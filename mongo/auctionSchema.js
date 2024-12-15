const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    channelId: { type: String, required: true, unique: true },
    userId: { type: String, required: true , unique: true },
    mypkinfoimage: { type: String, required: true},
    auctionEndTime: {type: Date, required: true},
    initialBid: { type: Number, required: true },
    currentBid: { type: Number, required: false },
    currentBidder: { type: String, required: false },
    autobuyPrice: { type: Number, required: true },
    bidInterval: { type: Number, required: true },
    isEnded: { type: Boolean, default: false },
    auctionEndTime: { type: Date, required: true }, 
    activeBidders: { type: [String], default: [] },
    winner: { type: String, default: null },
    timeRemaining: { type: Number, required: true }, 
});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = { Auction };
