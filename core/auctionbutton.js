const { Auction } = require('../mongo/auctionSchema');
const { placeBid, autobuy } = require('../core/auctionHandler');

module.exports = {
  async handleButtonInteraction(interaction, client) {
    if (!interaction.isButton()) return;

    const auction = await Auction.findOne({ channelId: interaction.channel.id });
    if (!auction) {
      return interaction.reply({
        content: 'No active auction found for this channel.',
        ephemeral: true,
      });
    }

    if (interaction.customId === 'bid') {
      const bidAmount = auction.currentBid + auction.bidInterval; 
      await placeBid(interaction, bidAmount, client);
    }

    if (interaction.customId === 'autobuy') {
      await autobuy(client, interaction);
    }
  }
};
