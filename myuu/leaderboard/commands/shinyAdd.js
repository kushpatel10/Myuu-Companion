const { PermissionsBitField} = require('discord.js');
const { ShinyTracker } = require('../../../database/schema');
const { createNoPermissionEmbed } = require('../../../core/embeds/mainEmbeds');
const {ownerId} = require('../../../config.js')

module.exports = {
    data: {
        name: 'add',
        description: 'Add shinies to a user',
        options: [
            {
                type: 'USER',
                name: 'user',
                description: 'User to add shinies to',
                required: true,
            },
            {
                type: 'INTEGER',
                name: 'amount',
                description: 'Number of shinies to add',
                required: true,
            },
        ],
    },

    async execute(interaction) {
        const isOwner = interaction.user.id === ownerId;
        if (!isOwner && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))  {
             const noPermissionEmbed = createNoPermissionEmbed();
            await interaction.reply({ embeds: [noPermissionEmbed]});
            return;
        }

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        const guildId = interaction.guildId;

        await ShinyTracker.findOneAndUpdate(
            { userId: user.id, guildId },
            { $inc: { shinyCount: amount } },
            { upsert: true, new: true }
        );

        await interaction.reply({
            content: `Added **${amount}** shinies to **${user.tag}**'s count!`,
        });
    },
};