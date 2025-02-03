const { createShinyEmbed, createLogEmbed, createShinyButton, createGithubUrlButton } = require('./embeds/mainEmbeds');
const {ShinyTracker, TimeoutPokemon, BotBannedUser } = require('../database/schema');

module.exports = async (SHINY_LOG_CHANNEL_MAP, message) => {
    try {
        if (message.author.bot && message.author.id === '438057969251254293') {
            if (message.embeds.length > 0) {
                const embedDescription = message.embeds[0]?.description;

                if (embedDescription?.includes("A wild")) {
                    const logChannelId = SHINY_LOG_CHANNEL_MAP[message.guild.id];
                    if (!logChannelId) return;
                    const shinyUserId = message.interactionMetadata?.user?.id;
                    if (!shinyUserId) return;

                    const guildMember = await message.guild.members.fetch(shinyUserId);
                    
                    const botBannedUser = await BotBannedUser.findOne({ userId: shinyUserId }); 
                    if (botBannedUser) {
                        await message.channel.send({
                            content: `Sorry ${guildMember}, you are bot-banned and cannot use this feature.`,
                        });
                        return; 
                    }

                    const timeoutRecord = await TimeoutPokemon.findOne({
                        userId: shinyUserId,
                        guildId: message.guild.id,
                    });

                    if (timeoutRecord) {
                        const timeoutPokemonList = timeoutRecord.pokemonList;
                        if (timeoutPokemonList.some(pokemon => embedDescription.includes(pokemon))) {
                            const pokemonName = timeoutPokemonList.find(pokemon => embedDescription.includes(pokemon));

                            try {
                                await guildMember.timeout(10 * 1000, `Found a timeout Pokémon: ${pokemonName}`);
                            } catch (err) {
                                console.error('Timeout failed:', err);
                            }

                            await message.channel.send({
                                content: `${guildMember}, you encountered ${pokemonName}, which is on your timeout list!`,
                            });
                            return; 
                        }
                    }

                    const processSpecialPokemon = async (pokemonType) => {

                        try {
                            await guildMember.timeout(10 * 1000, `Caught a ${pokemonType}`);
                        } catch (err) {
                            console.error(`Failed to timeout user for ${pokemonType}:`, err);
                        }
                        
                        let routeCountMessage = '';
                        try {
                            const userRecord = await ShinyTracker.findOne({
                                userId: shinyUserId,
                                guildId: message.guild.id,
                            });

                            if (userRecord) {
                                routeCountMessage = ` GG it only took you ${userRecord.routeCount} cotton picks.`;
                            } else {
                                routeCountMessage = ' GG it only took you 0 cotton picks.';
                            }

                            await ShinyTracker.findOneAndUpdate(
                                { userId: shinyUserId, guildId: message.guild.id },
                                { $inc: { shinyCount: 1 }, $set: { routeCount: 0 } },
                                { upsert: true, new: true }
                            );
                        } catch (dbError) {
                            console.error('Error updating shiny count or route count in MongoDB:', dbError);
                        }

                        const messageUrl = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

                        const shinyEmbed = createShinyEmbed(guildMember, messageUrl, pokemonType);
                        await message.channel.send({
                            embeds: [shinyEmbed],
                            components: [
                                {
                                    type: 1,
                                    components: [createGithubUrlButton(), createShinyButton(messageUrl)],
                                },
                            ],
                        });

                        const logEmbed = createLogEmbed(message.embeds[0], pokemonType, guildMember);
                        const logChannel = await message.guild.channels.fetch(logChannelId);
                        if (!logChannel) return;
                        await logChannel.send({
                            content: `${guildMember} found a ${pokemonType}! ${routeCountMessage}`,
                            embeds: [logEmbed],
                            components: [
                                {
                                    type: 1,
                                    components: [createGithubUrlButton(), createShinyButton(messageUrl)],
                                },
                            ],
                        });

                        await message.channel.send({
                            content: `${guildMember}, you caught a ${pokemonType}! Enjoy your timeout lil bro!`,
                        });
                    };

                    if (embedDescription.includes("★")) {
                        await processSpecialPokemon('Shiny');
                    } else if (embedDescription.includes("Greninja-Ash")) {
                        await processSpecialPokemon('Greninja-Ash');
                    }
                }
            }
        }
    } catch (error) {
        console.error('An error occurred in messageCreate:', error);
    }
};