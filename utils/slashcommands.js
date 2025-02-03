const {ownerIds} = require('../config');

const ping = require('../general/commands/ping');
const botinfo = require('../general/commands/botinfo');
const serverinfo = require('../general/commands/serverinfo');
const {handleSlashCommand} = require('../general/downloader/reels');

const canTimeout = require('../myuu/pokemonTimeouts/canTimeout');
const routecount = require('../myuu/pokemonTimeouts/routecount');
const info = require('../myuu/pokemonTimeouts/pokemonList');
const timeoutPokemonAdd = require('../myuu/pokemonTimeouts/addPokemon');
const timeoutPokemonRemove = require('../myuu/pokemonTimeouts/removePokemon');

const add = require('../myuu/leaderboard/commands/shinyAdd');
const remove = require('../myuu/leaderboard/commands/shinyRemove');
const clear = require('../myuu/leaderboard/commands/leaderboardReset');
const leaderboardServer = require('../myuu/leaderboard/commands/leaderboardServer');

const auctionStart = require('../myuu/auction/commands/start');
const auctionEnd = require('../myuu/auction/commands/end');
const auctionAutobuy = require('../myuu/auction/commands/autobuy');
const auctionBid = require('../myuu/auction/commands/bid');

const markovCommands = require('../general/markov/markovCommands');

const { BotBannedUser } = require('../database/schema'); 

module.exports = {
    async handleSlashcommandInteraction(interaction, client, botBannedUsers) {
        if (interaction.isCommand()) {
            switch (interaction.commandName) {
                case 'reel':
                    await handleSlashCommand(interaction);
                    break;
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
                    if (!ownerIds.includes(interaction.user.id)) {
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
                    if (!ownerIds.includes(interaction.user.id)) {
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
                    } else {
                        console.log(`Unknown subcommand: ${subcommand}`);
                    }
                    break;
                }
    
                case 'timeoutpokemon': {
                    const subcommand = interaction.options.getSubcommand();
                
                    if (subcommand === 'add') {
                        await timeoutPokemonAdd.execute(interaction, client);
                    } else if (subcommand === 'remove') {
                        await timeoutPokemonRemove.execute(interaction, client);
                    } 
                      else {
                        console.log(`Unknown subcommand: ${subcommand}`);
                    }
                    break;
                }
                case 'setchannel': return markovCommands.setChannel(interaction);
                case 'removechannel': return markovCommands.removeChannel(interaction);
                case 'messagecount': return markovCommands.messageCount(interaction);
                case 'enablemarkov': return markovCommands.enableMarkov(interaction);
                case 'disablemarkov': return markovCommands.disableMarkov(interaction);
                default:
                    console.log(`Unknown command: ${interaction.commandName}`);
            }
        }
    }
}
