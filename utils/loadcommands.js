const { REST, Routes } = require('discord.js');
const { BOT_TOKEN, CLIENT_ID } = require('../config'); 
const { slashcommands } = require('./commands');  

const registerSlashCommands = async () => {
    const commands = slashcommands
    

    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error while registering slash commands:', error);
    }
};

module.exports = {
    registerSlashCommands,
};
