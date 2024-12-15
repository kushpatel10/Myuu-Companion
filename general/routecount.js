const { SlashCommandBuilder } = require('discord.js');
const ShinyTracker = require('../mongo/shinyTracker');  // Import shinyTracker model

module.exports = {
    data: new SlashCommandBuilder()
        .setName('routecount')
        .setDescription('Check the route count of a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to check route count for (defaults to yourself)')),

    async execute(interaction) {
        try {
            const user = interaction.options.getUser('user') || interaction.user;

            const userRecord = await ShinyTracker.findOne({ userId: user.id, guildId: interaction.guild.id });

            if (userRecord) {
                return interaction.reply(`${user.username}'s route count is: ${userRecord.routeCount}`);
            } else {
                return interaction.reply(`${user.username} has not started their route count yet. Route count is: 0`);
            }
        } catch (error) {
            console.error('Error in routecount command:', error);
            return interaction.reply('An error occurred while fetching the route count.');
        }
    }
};
