const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { pkcemoji } = require('../../../config');

function createAuctionEmbed(auction) {
    const startbid = auction.currentBid+auction.bidInterval
    const autobuyPrice = auction.autobuyPrice
    const bidInterval = auction.bidInterval
    const timeRemaining = auction.timeRemaining
    const user = auction.userId
    const image = auction.mypkinfoimage

    return new EmbedBuilder()
        .setTitle(`Auction for the pokemon`)
        .addFields(
            { name: 'Starting Bid', value: `**${startbid}** ${pkcemoji}`, inline:true },
            { name: 'Autobuy Price', value: `**${autobuyPrice}** ${pkcemoji}`, inline: true },
            { name: 'Interval', value: `**${bidInterval}** ${pkcemoji}`, inline: true },
        )
        .setImage(image)
        .setDescription(`Auctioneer <@${user}> \nEnds in **${timeRemaining} hours**`)
        .setColor('#FF9900')
        .setTimestamp()
        .setFooter({text: `Make sure to star the github repository`});
}

function createBidButton(auction) {
    const nextbid = auction.currentBid+auction.bidInterval
    return new ButtonBuilder()
        .setCustomId('bid')
        .setLabel(`Bid at ${nextbid}`)
        .setStyle(ButtonStyle.Primary)
        .setEmoji('<:pkc:1314554255897788478>')
}

function createAutobuyButton(auction) {
    const autobuyPrice = auction.autobuyPrice

    return new ButtonBuilder()
        .setCustomId('autobuy')
        .setLabel(`Autobuy at ${autobuyPrice}`)
        .setStyle(ButtonStyle.Success)
        .setEmoji('<:pkc:1314554255897788478>')
}

function createAuctionEndEmbed(auction, interaction) {
    const currentBid = auction.autobuyPrice
    return new EmbedBuilder()
        .setTitle(`Auction Ended`)
        .setDescription(`**Winner**: <@${interaction.user.id}>\nFinal Bid: **${currentBid}** ${pkcemoji}`)
        .setColor('#FF9900')
        .setFooter({ text: 'Make sure to star the Github Repository!'});
}

function createBidEmbed(auction){
    const nextbid = auction.currentBid+auction.bidInterval
    const autobuyPrice = auction.autobuyPrice
    const timeRemaining = auction.timeRemaining
    const user = auction.userId
    const image = auction.mypkinfoimage
    const currentbidder = auction.currentBidder

    return new EmbedBuilder()
        .setTitle(`Auction for the pokemon`)
        .addFields(
            { name: 'Next Bid', value: `**${nextbid}** ${pkcemoji}`, inline:true },
            { name: 'Autobuy Price', value: `**${autobuyPrice}** ${pkcemoji}`, inline: true },
        )
        .setImage(image)
        .setDescription(`Auctioneer <@${user}>  Ends in **${timeRemaining} hours** \nCurrent Bidder - <@${currentbidder}>`)
        .setColor('#FF9900')
        .setTimestamp()
        .setFooter({text: `Make sure to star the github repository`});
}
module.exports = {
    createAuctionEmbed,
    createBidEmbed,
    createBidButton,
    createAutobuyButton,
    createAuctionEndEmbed,
};