const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const startServer = require('./utils/expressServer');
const { BOT_TOKEN, CLIENT_ID, SHINY_LOG_CHANNEL_MAP, activity, ownerId } = require('./config');
const ping = require('./general/ping');
const botinfo = require('./general/botinfo');
const serverinfo = require('./general/serverinfo');
const canTimeout = require('./general/can_timeout');
const routecount = require('./general/routecount');
const mainHandler = require('./core/main');
const connectToMongoDB = require('./mongo/connect');
const info = require('./leaderboard/info');
const add = require('./leaderboard/add');
const remove = require('./leaderboard/remove');
const clear = require('./leaderboard/clear');
const leaderboardServer = require('./leaderboard/server');
const ShinyTracker = require('./mongo/shinyTracker');
const BotBannedUser = require('./mongo/BotBannedUser'); 
const auctionStart = require('./auction/start');
const auctionEnd = require('./auction/end');
const auctionAutobuy = require('./auction/autobuy');
const auctionBid = require('./auction/bid');
const auctionInfo = require('./auction/info');
const auctionHandler = require('./core/auctionHandler');
const { handleButtonInteraction } = require('./core/auctionbutton'); 
const auctionHandlerwallet = require('./core/auctionWallet');

connectToMongoDB();

const botBannedUsers = new Set();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});


const registerSlashCommands = async () => {
    const commands = [
        new SlashCommandBuilder()
            .setName('shiny')
            .setDescription('Manage shiny counts')
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('add')
                    .setDescription('Add shinies to a user')
                    .addUserOption((option) =>
                        option.setName('user').setDescription('The user to add shinies to').setRequired(true)
                    )
                    .addIntegerOption((option) =>
                        option.setName('amount').setDescription('Number of shinies to add').setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('remove')
                    .setDescription('Remove shinies from a user')
                    .addUserOption((option) =>
                        option.setName('user').setDescription('The user to remove shinies from').setRequired(true)
                    )
                    .addIntegerOption((option) =>
                        option.setName('amount').setDescription('Number of shinies to remove').setRequired(true)
                    )
            )
            .toJSON(),
        new SlashCommandBuilder().setName('ping').setDescription('Check the bot\'s ping, uptime, and system info').toJSON(),
        new SlashCommandBuilder().setName('botinfo').setDescription('Get information about the bot').toJSON(),
        new SlashCommandBuilder().setName('serverinfo').setDescription('Get information about the server').toJSON(),
        new SlashCommandBuilder()
            .setName('can_timeout')
            .setDescription('Check if the bot can timeout a specific user')
            .addUserOption((option) => option.setName('user').setDescription('The user to check (defaults to you)'))
            .toJSON(),
        new SlashCommandBuilder()
            .setName('info')
            .setDescription('Check the number of shinies you have found')
            .addUserOption((option) =>
                option.setName('user').setDescription('The user whose shiny count you want to check')
            )
            .toJSON(),
        new SlashCommandBuilder()
            .setName('leaderboard')
            .setDescription('Manage leaderboard data')
            .addSubcommand((subcommand) =>
                subcommand.setName('cleardata').setDescription('Clear leaderboard data')
            )
            .addSubcommand((subcommand) =>
                subcommand.setName('server').setDescription('Generate the server shiny leaderboard')
            )
            .toJSON(),
        new SlashCommandBuilder()
            .setName('routecount')
            .setDescription('Check the route count of a user')
            .addUserOption((option) =>
                option.setName('user').setDescription('The user to check route count for (defaults to yourself)')
            )
            .toJSON(),
        new SlashCommandBuilder()
            .setName('botban')
            .setDescription('Ban a user from using the bot (Admin only)')
            .addUserOption((option) =>
                option.setName('user').setDescription('The user to ban').setRequired(true)
            )
            .toJSON(),
        new SlashCommandBuilder()
            .setName('removebotban')
            .setDescription('Unban a user from using the bot (Admin only)')
            .addUserOption((option) =>
                option.setName('user').setDescription('The user to unban').setRequired(true)
            )
            .toJSON(),
            new SlashCommandBuilder()
        .setName('auction')
        .setDescription('Manage Pokémon auctions')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start an auction')
                .addIntegerOption(option => option.setName('time').setDescription('Auction duration in hours').setRequired(true))
                .addIntegerOption(option => option.setName('initialbid').setDescription('Staring bid amount').setRequired(true))
                .addIntegerOption(option => option.setName('autobuy').setDescription('Autobuy price').setRequired(true))
                .addIntegerOption(option => option.setName('interval').setDescription('Bid interval').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bid')
                .setDescription('Place a bid in an active auction')
                .addIntegerOption(option => option.setName('amount').setDescription('Amount to bid').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('autobuy')
                .setDescription('Use autobuy to win the auction')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End the auction manually')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Get info about the ongoing auction')
        )
        .toJSON(),
    ];

    const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error while registering slash commands:', error);
    }
};

client.on('ready', async () => {
    console.log(`${client.user.tag} is online!`);
    client.user.setActivity(activity, { type: 'PLAYING' });
    try {
        await auctionHandler.recoverActiveAuctions(client);
        console.log('Recovered active auctions successfully.');
    } catch (error) {
        console.error('Error recovering active auctions:', error);
    }
    try {
        const bannedUsers = await BotBannedUser.find({});
        bannedUsers.forEach((user) => botBannedUsers.add(user.userId));
        console.log(`Loaded ${botBannedUsers.size} banned users.`);
    } catch (error) {
        console.error('Error loading banned users:', error);
    }
    await registerSlashCommands();
    startServer(client);
});

client.on('interactionCreate', async (interaction) => {
    if (botBannedUsers.has(interaction.user.id)) {
        await interaction.reply({
            content: 'You are banned from using this bot.',
        });
        return;
    }

    if (interaction.isButton()) {
        try {
            await handleButtonInteraction(interaction, client);
        } catch (error) {
            console.error('Error handling button interaction:', error);
            await interaction.reply({ content: 'There was an error while processing your request.', ephemeral: true });
        }
    }

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
            case 'routecount':
                await routecount.execute(interaction, client);
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
            case 'botban': {
                const user = interaction.options.getUser('user');
                if (interaction.user.id !== ownerId) {
                    return interaction.reply({
                        content: 'Only the bot owner can execute this command.',
                    });
                }

                await BotBannedUser.findOneAndUpdate(
                    { userId: user.id },
                    { userId: user.id },
                    { upsert: true }
                );
                botBannedUsers.add(user.id); 
                interaction.reply(`Successfully banned ${user.tag} from using the bot.`);
                break;
            }
            case 'removebotban': {
                const user = interaction.options.getUser('user');
                if (interaction.user.id !== ownerId) {
                    return interaction.reply({
                        content: 'Only the bot owner can execute this command.',
                    });
                }

                await BotBannedUser.deleteOne({ userId: user.id });
                botBannedUsers.delete(user.id); 
                interaction.reply(`Successfully unbanned ${user.tag}.`);
                break;
            }
            case 'auction': {
                const subcommand = interaction.options.getSubcommand();

                if (subcommand === 'start') {
                    await auctionStart.execute(interaction ,client);
                } else if (subcommand === 'bid') {
                    await auctionBid.execute(interaction , client); 
                } else if (subcommand === 'autobuy') {
                    await auctionAutobuy.execute(interaction, client); 
                } else if (subcommand === 'end') {
                    await auctionEnd.execute(interaction); 
                } else if (subcommand === 'info') {
                    await auctionInfo.execute(interaction);
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
        if (message.author.id === "438057969251254293" && message.embeds.length > 0 && message.interaction?.commandName === 'wallet') {
            await auctionHandlerwallet.handleWalletEmbed(message, client);
        } else if (message.author.bot && message.author.id === '438057969251254293') {
            if (message.embeds.length > 0) {
                const embedDescription = message.embeds[0]?.description;
                if (embedDescription?.includes('A wild')) {
                    const userId = message.interactionMetadata?.user?.id;
                    if (!userId) return;

                    await ShinyTracker.findOneAndUpdate(
                        { userId: userId, guildId: message.guild.id },
                        { $inc: { routeCount: 1 } },
                        { upsert: true, new: true }
                    );
                    mainHandler(client, SHINY_LOG_CHANNEL_MAP, message);
                }
            } else {
                mainHandler(client, SHINY_LOG_CHANNEL_MAP, message);
            }
        }
    } catch (error) {
        console.error('Error handling messageCreate:', error);
    }
});

client.login(BOT_TOKEN).then(() => {
    console.log('Bot successfully logged in!');
}).catch((error) => {
    console.error('Error logging in:', error);
});
