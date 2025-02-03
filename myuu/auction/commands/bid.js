const { SlashCommandBuilder } = require('discord.js');
const { placeBid } = require('../handlers/auctionHandler');
const {Auction} = require('../../../database/schema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auction')
        .setDescription('Place a bid for the ongoing auction.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('bid')
                .setDescription('Place a bid with a specific amount.')
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('The bid amount')
                        .setRequired(true)
                        .setMinValue(1))),

    async execute(interaction , client) {

        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        const user = interaction.user;
        const amount = interaction.options.getInteger('amount');
        const channel = interaction.channel;

        const auctionData = await Auction.findOne({ channelId: channel.id });

        if (!auctionData) {
            return interaction.reply({
                content: 'No active auction found in this channel.',
                ephemeral: true,
            });
        }

        if (auctionData.isEnded) {
            return interaction.reply({
                content: 'This auction has already ended.',
                ephemeral: true,
            });
        }

        if (amount % auctionData.bidInterval !== 0) {
            return interaction.reply({
                content: `Bid must be a multiple of the bid interval of ${auctionData.bidInterval}.`,
                ephemeral: true,
            });
        }

        await placeBid(interaction, amount, client);

    },
};