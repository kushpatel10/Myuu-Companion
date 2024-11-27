const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const startServer = require('./utils/expressServer');
const { BOT_TOKEN, CLIENT_ID, EXPRESS_PORT, SHINY_LOG_CHANNEL_MAP , activity} = require('./config');
const ping = require('./general/ping');
const botinfo = require('./general/botinfo');
const serverinfo = require('./general/serverinfo');
const canTimeout = require('./general/can_timeout');
const mainHandler = require('./core/main');
const connectToMongoDB = require('./mongo/connect');
const info = require('./leaderboard/info');
const add = require('./leaderboard/add');
const remove = require('./leaderboard/remove');
const clear = require('./leaderboard/clear');
const leaderboardServer = require('./leaderboard/server');

connectToMongoDB();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const registerSlashCommands = async () => {
    const commands = [
        new SlashCommandBuilder()
            .setName('shiny')
            .setDescription('Manage shiny counts')
            .addSubcommand(subcommand =>
             subcommand
            .setName('add')
            .setDescription('Add shinies to a user')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('The user to add shinies to')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('amount')
                    .setDescription('Number of shinies to add')
                    .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand
            .setName('remove')
            .setDescription('Remove shinies from a user')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('The user to remove shinies from')
                    .setRequired(true))
            .addIntegerOption(option =>
                option.setName('amount')
                    .setDescription('Number of shinies to remove')
                    .setRequired(true)))
                  .toJSON(),
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Check the bot\'s ping, uptime, and system info')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('botinfo')
            .setDescription('Get information about the bot')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('Get information about the server')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('can_timeout')
            .setDescription('Check if the bot can timeout a specific user')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('The user to check (defaults to you)')
            )
            .toJSON(),
        new SlashCommandBuilder()
            .setName('info')
            .setDescription('Check the number of shinies you have found')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('The user whose shiny count you want to check')
            )
            .toJSON(),
        new SlashCommandBuilder()
            .setName('leaderboard')
            .setDescription('Manage leaderboard data')
            .addSubcommand(subcommand =>
             subcommand
            .setName('cleardata')
            .setDescription('Clear leaderboard data'))
            .addSubcommand(subcommand =>
                subcommand
                    .setName('server')
                    .setDescription('Generate the server shiny leaderboard'))
            .toJSON(),
    ];

    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error while registering slash commands:', error);
    }
};

client.on('ready', async () => {
    console.log(`${client.user.tag} is online!`);
    client.user.setActivity(activity, { type: 'PLAYING' });

    await registerSlashCommands();

    startServer(client);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        switch (interaction.commandName) {
            case 'ping':
                await ping.execute(interaction, client);
                break;
            case 'botinfo':
                await botinfo.execute(interaction, client);
                break;
            case 'serverinfo':
                await serverinfo.execute(interaction, client);
                break;
            case 'can_timeout':
                await canTimeout.execute(interaction, client);
                break;
            case 'info':
                await info.execute(interaction, client);
                break;
            case 'shiny': {
                    const subcommand = interaction.options.getSubcommand();
    
                    if (subcommand === 'add') {
                        await add.execute(interaction);
                    } else if (subcommand === 'remove') {
                        await remove.execute(interaction);
                    } else {
                        console.log(`Unknown subcommand: ${subcommand}`);
                    }
                    break;
                }
                case 'leaderboard': {
                    const subcommand = interaction.options.getSubcommand();
            
                    if (subcommand === 'cleardata') {
                        await clear.execute(interaction);
                    } else if (subcommand === 'server') {
                        await leaderboardServer.execute(interaction);
                    } else {
                        console.log(`Unknown subcommand: ${subcommand}`);
                    }
                    break;
                }
            
            default:
                console.log(`Unknown command: ${interaction.commandName}`);
        }
    }
});

client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot && message.author.id === '438057969251254293') {
            mainHandler(client, SHINY_LOG_CHANNEL_MAP, message);
        }
    } catch (error) {
        console.error('Error handling messageCreate:', error);
    }
});

// Login to Discord
client.login(BOT_TOKEN).then(() => {
    console.log('Logged in successfully!');
}).catch((error) => {
    console.error('Error logging in:', error);
});
