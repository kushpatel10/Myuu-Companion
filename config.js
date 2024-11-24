// Bot Token
const BOT_TOKEN = 'BOT_TOKEN'; // Replace with your actual bot token

// Client ID (Your bot's application ID on Discord)
const CLIENT_ID = 'BOT_ID'; // Replace with your actual client ID

// MongoDB Configuration (for future integration)
const MONGO_URI = 'YOUR_MONGO_URI_HERE'; // Replace with your MongoDB connection URI (Not yet added so can leave blank)

// Express Server Configuration
const EXPRESS_PORT = 8000; // You can modify the port here if you need to

// Format to add shiny log: 'GUILD_ID': 'CHANNEL_ID'. Btw u can add multiple guilds in the same format
const SHINY_LOG_CHANNEL_MAP = {
    'SERVER1': 'LOG_CHANNEL_ID', 
    'SERVER2': 'LOG_CHANNEL_ID', 
};

// Exporting all configurations
module.exports = {
    BOT_TOKEN,
    CLIENT_ID,
    MONGO_URI,
    EXPRESS_PORT,
    SHINY_LOG_CHANNEL_MAP,
};
