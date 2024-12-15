const { SlashCommandBuilder } = require('discord.js');
const { createCanTimeoutEmbed } = require('../embed/mainembeds'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('can_timeout')
        .setDescription('Check if the bot can timeout a specific user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to check (defaults to you)')
        ),

    async execute(interaction) {
        try {
            const targetUser = interaction.options.getUser('user') || interaction.user; 
            const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

            if (!targetMember) {
                return interaction.reply({ content: 'Unable to find the specified user in this server.' });
            }

            const botMember = await interaction.guild.members.fetchMe();
            const canTimeout = targetMember.moderatable && botMember.roles.highest.comparePositionTo(targetMember.roles.highest) > 0;

            const timeoutEmbed = createCanTimeoutEmbed(canTimeout, targetUser);

            await interaction.reply({ embeds: [timeoutEmbed] });
        } catch (error) {
            console.error('Error executing can_timeout command:', error);
            await interaction.reply('There was an error while executing this command!');
        }
    },
};
