const { SlashCommandBuilder } = require('discord.js');
const { createBotInfoEmbed } = require('../embed/mainembeds'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Get information about the bot'),

    async execute(interaction, client) {
        try {
            const botInfoEmbed = createBotInfoEmbed(client);
            await interaction.reply({ embeds: [botInfoEmbed] });
        } catch (error) {
            console.error('Error executing botinfo command:', error);
            await interaction.reply('There was an error while executing this command!');
        }
    },
};
