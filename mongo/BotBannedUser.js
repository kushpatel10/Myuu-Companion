const mongoose = require('mongoose');

const BotBannedUserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
});

const BotBannedUser = mongoose.model('BotBannedUser', BotBannedUserSchema);

module.exports = BotBannedUser;
