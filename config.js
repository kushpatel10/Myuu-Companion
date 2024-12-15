// Bot Token --- Required
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Replace with your actual bot token  

// Client ID (Your bot's application ID on Discord) --- Required
const CLIENT_ID = 'YOUR_BOT_ID'; // Replace with your actual client ID

// MongoDB Configuration (for future integration) --- Required
const MONGO_URI = 'MONGO_URI_HERE'; // Replace with your MongoDB connection URI (Not yet added so can leave blank)

// Express Server Configuration
const EXPRESS_PORT = 8000; // You can modify the port here if you need to

// Format to add shiny log: 'GUILD_ID': 'CHANNEL_ID'.
const SHINY_LOG_CHANNEL_MAP = {
    'GUILD_ID': 'SHINY_LOG_CHANNEL_ID', 
    'GUILD_ID': 'SHINY_LOG_CHANNEL_ID', 
};

const botactivity = "BOT_ACTIVITY_HERE",
const pkcemoji = "<:EMOJI_NAME:EMOJI_ID>",
// Exporting all configurations
module.exports = {
    BOT_TOKEN,
    CLIENT_ID,
    MONGO_URI,
    EXPRESS_PORT,
    SHINY_LOG_CHANNEL_MAP,
    botactivity,
};
