const { Client, GatewayIntentBits } = require('discord.js');
const startServer = require('./utils/expressServer');
const { BOT_TOKEN, SHINY_LOG_CHANNEL_MAP, activity} = require('./config');
const { connectToMongoDB } = require('./database/connect');
const {ShinyTracker, BotBannedUser} = require('./database/schema');
const auctionHandler = require('./myuu/auction/handlers/auctionHandler');
const {handleButtonInteraction} = require('./myuu/auction/handlers/auctionButton'); 
const {handleInstagramReelCommand} = require('./general/downloader/reels');
const {handleTiktokCommand} = require('./general/downloader/tiktok');
const {handleYoutubeShortsCommand} = require('./general/downloader/youtube')
const {registerSlashCommands} = require('./utils/loadcommands');  
const {handleSlashcommandInteraction} = require('./utils/slashcommands')
const mainHandler = require('./core/main')
const auctionHandlerwallet = require('./myuu/auction/handlers/auctionWallet');
const { handleMessage } = require('./general/markov/markovMessage');

connectToMongoDB();

const botBannedUsers = new Set();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

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
    await handleSlashcommandInteraction(interaction, client, botBannedUsers)
    }
});

client.on('messageCreate', async (message) => {
    try {

        if (botBannedUsers.has(message.author.id)) {
            return;
        }
        
          await handleYoutubeShortsCommand(message, client)
          await handleInstagramReelCommand(message, client);
          await handleTiktokCommand(message, client)
          await handleMessage(client, message)

      if (message.author.id === "438057969251254293" && message.embeds.length > 0 && message.interaction?.commandName === 'wallet') {
          console.log('ok')
            await auctionHandlerwallet.handleWalletEmbed(message, client);
        } 
         else if (message.author.bot && message.author.id === '438057969251254293') {
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
                    mainHandler(SHINY_LOG_CHANNEL_MAP, message);
                }
            } else {
                mainHandler(SHINY_LOG_CHANNEL_MAP, message);
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
