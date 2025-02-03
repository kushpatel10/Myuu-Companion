const mongoose = require('mongoose');

const BotBannedUserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
});

const BotBannedUser = mongoose.model('BotBannedUser', BotBannedUserSchema);

const timeoutPokemonSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    pokemonList: { type: [String], default: [] }, 
});

const TimeoutPokemon = mongoose.model('TimeoutPokemon', timeoutPokemonSchema);

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

const shinySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    shinyCount: { type: Number, default: 0 },
    routeCount: { type: Number, default: 0 },  
});

const ShinyTracker = mongoose.model('ShinyTracker', shinySchema);

const walletSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    coins: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Wallet = mongoose.model('Wallet', walletSchema)

const markovMessageSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    message: { type: String, required: true },
    authorId: { type: String, required: true },
    expireAt: { type: Date, default: () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) } 
});

markovMessageSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
const MarkovMessage = mongoose.model('MarkovMessage', markovMessageSchema);

const markovSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    channels: { type: [String], default: [] },
    enabled: { type: Boolean, default: false },
    mode: { type: String, default: 'random' }
});

const MarkovSettings = mongoose.model('MarkovSettings', markovSettingsSchema);

module.exports = {
    Auction,
    Wallet,
    ShinyTracker,
    BotBannedUser,
    TimeoutPokemon,
    MarkovMessage,
    MarkovSettings
};
