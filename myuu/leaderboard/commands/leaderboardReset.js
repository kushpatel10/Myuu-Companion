const { PermissionsBitField, ActionRowBuilder } = require('discord.js');
const { ShinyTracker } = require('../../../database/schema');
const {createNoPermissionEmbed, createConfirmClearEmbed, createClearSuccessButton, createClearCancelButton} = require('../../../core/embeds/mainEmbeds');
const {ownerId} = require('../../../config.js')

module.exports = {
    data: {
        name: 'clear',
        description: 'Clear server shiny data',
    },

    async execute(interaction) {
        const isOwner = interaction.user.id === ownerId;
        if (!isOwner && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))  {
             const noPermissionEmbed = createNoPermissionEmbed();
             interaction.reply({ embeds: [noPermissionEmbed]});
            return;
        }

        const confirmEmbed = createConfirmClearEmbed();
        const yesButton = createClearSuccessButton();
        const noButton = createClearCancelButton();
        const row = new ActionRowBuilder().addComponents(yesButton, noButton);

        await interaction.reply({
            embeds: [confirmEmbed],
            components: [row],
        });

        const filter = (buttonInteraction) => {
            return buttonInteraction.user.id === interaction.user.id;
        };

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (buttonInteraction) => {
            if (buttonInteraction.customId === 'clear_yes') {
                try {
                    await ShinyTracker.deleteMany({ guildId: interaction.guildId });
                    await buttonInteraction.reply({
                        content: 'All shiny data has been cleared from the server.',
                    });
                } catch (error) {
                    console.error('Error clearing shiny data:', error);
                    await buttonInteraction.reply({
                        content: 'An error occurred while clearing shiny data. Please try again later.',
                    });
                }
            } else if (buttonInteraction.customId === 'clear_no') {
                await buttonInteraction.reply({
                    content: 'Shiny data clearing was canceled.',
                    ephemeral: true,
                });
            }

            await interaction.editReply({
                components: [],
            });
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.editReply({
                    components: [],
                });
            }
        });
    },
};