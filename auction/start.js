const { SlashCommandBuilder, Message , PermissionFlagsBits } = require('discord.js');
const { startAuction } = require('../core/auctionHandler');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auction')
        .setDescription('Start a Pokémon auction in the channel.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a new auction')
                .addIntegerOption(option =>
                    option
                        .setName('time')
                        .setDescription('Auction duration in hours')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('initialbid') 
                        .setDescription('Starting bid for the auction')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('autobuy')
                        .setDescription('Autobuy price for the auction')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('interval')
                        .setDescription('Bid interval in the auction')
                        .setRequired(true)
                )),

    async execute(interaction, client) {
        try {
            if (!interaction.guild) {
                await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
                return;
            }
            
            const time = interaction.options.getInteger('time');
            const initialbid = interaction.options.getInteger('initialbid');
            const autobuy = interaction.options.getInteger('autobuy');
            const interval = interaction.options.getInteger('interval');
            
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return interaction.reply({
                    content: `You don't have **MANAGE ROLES** permissions to execute this command.`,
                    ephemeral: true,
                });
            }
            if (autobuy <= initialbid) {
                return interaction.reply({
                    content: '❌ Autobuy price must be greater than the initial bid.',
                    ephemeral: true
                });
            }

            if (initialbid < interval) {
                return interaction.reply({
                    content: '❌ Initial bid must be greater than or equal to the bid interval.',
                    ephemeral: true
                });
            }

            const user = interaction.user;

            await interaction.reply({ 
                content: 'Please run the </mypkinfo:1033315380233510962> or </box pk:1033315380233510962> command within 60 seconds to proceed with the auction.', 
                fetchReply: true 
            });

            let mypkinfoUsed = false;

            const messageListener = async (message) => {
                try {
                    if ((message.interaction?.commandName === 'mypkinfo' || message.interaction?.commandName === 'box pk') &&
                        interaction.user.id === user.id && 
                        message.channel.id === interaction.channel.id 
                    ){

                        mypkinfoUsed = true; 
                        client.removeListener('messageCreate', messageListener);
                        await interaction.editReply({
                            content: '✅ You successfully ran /mypkinfo. Starting the auction process!',
                        });

                        const attachment = message.attachments.first();
                        if (!attachment || !attachment.url) {
                            await interaction.editReply({
                                content: '❌ No attachment found in /mypkinfo. Auction process stopped.',
                            });
                            return;
                        }
                        let mypkinfoimg;
                        try {
                            const response = await fetch(attachment.url);
                            if (!response.ok) {
                                throw new Error('Failed to fetch the image');
                            }
                            mypkinfoimg = await response.url;
                        } catch (error) {
                            await interaction.editReply({
                                content: `❌ Error fetching the image: ${error.message}. Auction process stopped.`,
                            });
                            return;
                        }

                        const auctionData = {
                            channelId: interaction.channel.id,
                            initialBid: initialbid,
                            autobuyPrice: autobuy,
                            bidInterval: interval,
                            userId: user.id,
                            timeRemaining: time,
                        };
                        await startAuction(interaction.client, interaction, auctionData, message, mypkinfoimg, time);
                        client.removeListener('messageCreate', messageListener);
                    }
                } catch (err) {
                    console.error('Error in message listener:', err);
                }
            };

            client.on('messageCreate', messageListener);

            setTimeout(async () => {
                if (!mypkinfoUsed) {
                    client.removeListener('messageCreate', messageListener);
                    await interaction.editReply({
                        content: '⏳ You did not run /mypkinfo in time. Auction process stopped.',
                    });
                }
            }, 60000); 
        } catch (err) {
            console.error('Error in auction command:', err);
            await interaction.reply({
                content: `❌ An unexpected error occurred: ${err.message}`,
                ephemeral: true,
            });
        }
    }
};
