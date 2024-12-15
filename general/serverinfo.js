const { SlashCommandBuilder } = require('discord.js');
const { createServerInfoEmbed } = require('../embed/mainembeds'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get information about the server'),

    async execute(interaction) {
        try {
            const guild = interaction.guild;
            const owner = await guild.fetchOwner();

            const serverInfoEmbed = createServerInfoEmbed(guild, owner);

            await interaction.reply({ embeds: [serverInfoEmbed] });
        } catch (error) {
            console.error('Error executing serverinfo command:', error);
            await interaction.reply('There was an error while executing this command!');
        }
    },
};
