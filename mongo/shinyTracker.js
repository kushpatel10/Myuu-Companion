const mongoose = require('mongoose');

const shinySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    shinyCount: { type: Number, default: 0 },
    routeCount: { type: Number, default: 0 },  
});

module.exports = mongoose.model('ShinyTracker', shinySchema);
