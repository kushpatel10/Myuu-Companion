const { EmbedBuilder, ActionRowBuilder } = require('discord.js');
const { Auction } = require('../mongo/auctionSchema'); 
const {createAuctionEmbed,createBidEmbed,createAuctionEndEmbed,createBidButton,createAutobuyButton} = require('../embed/auctionembeds');
const Wallet = require('../mongo/walletSchema');
const { pkcemoji } = require('../config');

module.exports = {

    async recoverActiveAuctions(client) {
        const now = Date.now();
        const activeAuctions = await Auction.find({ auctionEndTime: { $gte: now } });
        const expiredAuctions = await Auction.find({ auctionEndTime: { $lt: now } });

        for (const auction of expiredAuctions) {
            console.log(`Ending expired auction in channel ${auction.channelId}`);
            await this.endAuction(client, auction.channelId);
        }

        for (const auction of activeAuctions) {
            const { channelId, auctionEndTime } = auction;

            if (auctionEndTime > now) {
                console.log(`Recovering active auction in channel ${channelId}`);
                this.monitorAuctionEnd(client, channelId, auctionEndTime);
            }
        }
    },

    async startAuction(client, interaction, auctionData, message , mypkinfoimg) {
        const { channelId, initialBid, autobuyPrice, bidInterval, userId, timeRemaining} = auctionData;
          if (!timeRemaining || isNaN(timeRemaining) || timeRemaining <= 0) {
            return interaction.editReply({
                content: 'Invalid or missing `timeRemaining` for the auction. Please specify a valid duration.',
            });
        }
    
        const existingAuction = await Auction.findOne({ channelId });
        if (existingAuction) {
            return interaction.editReply({
                content: 'An auction is already running in this channel.',
            });
        }
    
        const auctionEndTime = new Date(Date.now() + timeRemaining * 60 * 60 * 1000);
    
        if (isNaN(auctionEndTime.getTime())) {
            return interaction.editReply({
                content: 'Failed to calculate the auction end time. Please check your inputs.',
            });
        }
    
        const auction = new Auction({
            channelId,
            userId,
            initialBid,
            currentBid: initialBid,
            autobuyPrice,
            bidInterval,
            auctionEndTime,
            timeRemaining,
            currentBidder: null,
            mypkinfoimage: mypkinfoimg, 
        });
    
        await auction.save();
    
        const auctionEmbed = createAuctionEmbed(auction);
        const bidButton = createBidButton(auction);
        const autobuyButton = createAutobuyButton(auction);
        const bidRow = new ActionRowBuilder().addComponents(bidButton, autobuyButton);
    
        await message.reply({
            embeds: [auctionEmbed],
            components: [bidRow],
        });
    
        module.exports.monitorAuctionEnd(client, channelId, auctionEndTime);
    },

    async autobuy(client, interaction) {
        const auction = await Auction.findOne({ channelId: interaction.channel.id });
        if (!auction) {
            return interaction.reply({ content: 'No active auction in this channel.', ephemeral: true });
        }

        const wallet = await Wallet.findOne({ userId: interaction.user.id });
        if (!wallet) {
            return interaction.reply({
                content: "Your wallet isn't registered. Please use </wallet:1033315382330667029> to register your wallet.",
                ephemeral: true,
            });
        }

        if (wallet.coins < auction.autobuyPrice) {
            return interaction.reply({
                content: `You don't have enough PKC ${pkcemoji} to use autobuy. Please use </wallet:1033315382330667029> to update your wallet.`,
                ephemeral: true,
            });
        }

        if (interaction.user.id === auction.userId) {
            return interaction.reply({
                content: 'You cannot bid on an auction you are hosting.',
                ephemeral: true,
            });
        }

        auction.currentBid = auction.autobuyPrice;
        auction.currentBidder = interaction.user.id;

        await auction.save();

        const autobuyEmbed = createAuctionEndEmbed(auction, interaction);
        await interaction.reply({
            content: `Auction ended. <@${interaction.user.id}> has bought the item via autobuy.`,
            embeds: [autobuyEmbed],
        });

        await module.exports.endAuction(client, auction.channelId);
    },

    async monitorAuctionEnd(client, channelId, auctionEndTime) {
        const checkAuctionEnd = async () => {
            const now = Date.now();

            if (now >= auctionEndTime) {
                await this.endAuction(client, channelId);
                return true;
            }
            return false; 
        };

        const intervalId = setInterval(async () => {
            const ended = await checkAuctionEnd();
            if (ended) {
                clearInterval(intervalId); 
            }
        }, 60 * 60 * 1000); 
    },

    async placeBid(interaction, bidAmount, client) {
        const auction = await Auction.findOne({ channelId: interaction.channel.id });
        if (!auction) {
            return interaction.reply({ content: 'No active auction in this channel.', ephemeral: true });
        }

        const wallet = await Wallet.findOne({ userId: interaction.user.id });
        if (!wallet) {
            return interaction.reply({
                content: "Your wallet isn't registered. Please use </wallet:1033315382330667029> to register your wallet.",
                ephemeral: true,
            });
        }

        if (interaction.user.id === auction.userId) {
            return interaction.reply({
                content: 'You cannot bid on an auction you are hosting.',
                ephemeral: true,
            });
        }

        if (interaction.user.id === auction.currentBidder) {
            return interaction.reply({
                content: 'You are already the highest bidder. You cannot bid again.',
                ephemeral: true,
            });
        }

        if (bidAmount < auction.currentBid + auction.bidInterval) {
            return interaction.reply({
                content: `Your bid must be at least ${auction.currentBid + auction.bidInterval}.`,
                ephemeral: true,
            });
        }

        if (wallet.coins < bidAmount) {
            return interaction.reply({
                content: `You don't have enough PKC ${pkcemoji} to place this bid. If you think this is an error please use </wallet:1033315382330667029> to update your wallet.`,
                ephemeral: true,
            });
        }
        const previousBidderId = auction.currentBidder;

        auction.currentBid = bidAmount;
        auction.currentBidder = interaction.user.id;

        if (bidAmount >= auction.autobuyPrice) {
            auction.currentBid = auction.autobuyPrice;
            await auction.save();

            const autobuyEmbed = createAuctionEndEmbed(auction, interaction);
            await interaction.reply({
                content: `Auction ended. <@${interaction.user.id}> has bought the item.`,
                embeds: [autobuyEmbed],
            });

            await module.exports.endAuction(client, auction.channelId);
            return;
        }

        await auction.save();

        const previousBidderMention = previousBidderId ? `<@${previousBidderId}>` : null;

        const bidEmbed = createBidEmbed(auction);
        const bidButton = createBidButton(auction);
        const autobuyButton = createAutobuyButton(auction);
        const bidRow = new ActionRowBuilder().addComponents(bidButton, autobuyButton);

        await interaction.reply({
            content: `You have placed a bid of ${auction.currentBid} ${pkcemoji} for the ongoing auction.`,
            ephemeral: true,
        });

        const channel = await client.channels.fetch(interaction.channel.id);
        await channel.send({
            content: `A new bid has been placed for **${auction.currentBid}** ${pkcemoji}. ${
                previousBidderMention ? `${previousBidderMention}, you've been outbid!` : '_ _'
            }`,
            embeds: [bidEmbed],
            components: [bidRow],
        });
    },

       async endAuction(client, channelId) {
        const auction = await Auction.findOne({ channelId });
        if (!auction) {
            console.log('No auction found for channel', channelId);
            return;
        }
        const winner = auction.currentBidder
            ? await client.users.fetch(auction.currentBidder)
            : null;
        const host = auction.userId;

        const finalEmbed = new EmbedBuilder()
            .setTitle('Auction Ended')
            .setDescription(
                winner
                    ? `<@${winner.id}> won the auction with a bid of **${auction.currentBid}** ${pkcemoji} .`
                    : 'No bids were placed, so the auction has ended without a winner.'
            )
            .setColor('#00FF00')
            .setTimestamp();

        const channel = await client.channels.fetch(channelId);
        await channel.send({ content: `<@${host}>`, embeds: [finalEmbed] });

        await Auction.deleteOne({ channelId });
    },
};
