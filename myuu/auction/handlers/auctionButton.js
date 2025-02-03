const { Auction } = require('../../../database/schema');
const { placeBid, autobuy } = require('./auctionHandler');

module.exports = {
  async handleButtonInteraction(interaction, client) {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'bid' || interaction.customId === 'autobuy') {
      const auction = await Auction.findOne({ channelId: interaction.channel.id });

      if (!auction) {
        return interaction.reply({
          content: 'No active auction found for this channel.',
          ephemeral: true,
        });
      }

      // Handle auction actions
      if (interaction.customId === 'bid') {
        const bidAmount = auction.currentBid + auction.bidInterval;
        await placeBid(interaction, bidAmount, client);
      }

      if (interaction.customId === 'autobuy') {
        await autobuy(client, interaction);
      }
    }
  }
};