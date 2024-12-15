const { SlashCommandBuilder } = require('discord.js');
const { Auction } = require('../mongo/auctionSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auction')
        .setDescription('View details about the current auction.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Get information about the ongoing auction.')),

    async execute(interaction) {
        const channel = interaction.channel;

        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        const auctionData = await Auction.findOne({ channelId: channel.id });

        if (!auctionData) {
            return interaction.reply({
                content: 'There is no active auction in this channel.',
                ephemeral: true,
            });
        }

        if (auctionData.isEnded) {
            return interaction.reply({
                content: 'This auction has already ended.',
                ephemeral: true,
            });
        }

        const auctionInfoEmbed = {
            title: `Auction Info for ${auctionData.pokemonName}`,
            description: `**Current Bid:** ${auctionData.currentBid}\n` +
                         `**Next Bid Interval:** ${auctionData.bidInterval}\n` +
                         `**Autobuy Price:** ${auctionData.autobuyPrice}\n` +
                         `**Time Left:** ${auctionData.timeRemaining} hours\n` +
                         `**Bidders:** ${auctionData.activeBidders.join(', ')}`,
            color: '#57f287',
            timestamp: new Date(),
        };

        await interaction.reply({
            embeds: [auctionInfoEmbed],
        });
    },
};
