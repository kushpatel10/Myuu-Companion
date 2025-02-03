const { SlashCommandBuilder } = require('discord.js');
const os = require('os'); 
const { createPingEmbed } = require('../../core/embeds/mainEmbeds'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s ping, uptime, and system info'),

    async execute(interaction , client) {
        try {
            const totalMemory = os.totalmem() / (1024 * 1024 * 1024); 
            const freeMemory = os.freemem() / (1024 * 1024 * 1024); 
            const usedMemory = totalMemory - freeMemory;

            const uptime = process.uptime(); 
            const uptimeFormatted = new Date(uptime * 1000).toISOString().substr(11, 8); 

            const pingEmbed = createPingEmbed(client, totalMemory, freeMemory, usedMemory, uptimeFormatted);

            await interaction.reply({ embeds: [pingEmbed] });
        } catch (error) {
            console.error('Error executing ping command:', error);
            await interaction.reply('There was an error while executing this command!');
        }
    },
};