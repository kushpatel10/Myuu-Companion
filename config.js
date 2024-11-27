// Bot Token
const BOT_TOKEN = 'BOT-TOKEN'; // Replace with your actual bot token

// Client ID (Your bot's application ID on Discord)
const CLIENT_ID = 'BOTS-ID'; // Replace with your actual client ID

// MongoDB Configuration (needed)
const MONGO_URI = 'MONGO-URI'; // Replace with your MongoDB connection URI 

// Express Server Configuration
const EXPRESS_PORT = 8000; // You can modify the port here if you need to

// Format to add shiny log: 'GUILD_ID': 'CHANNEL_ID'. Btw u can add multiple guilds in the same format
const SHINY_LOG_CHANNEL_MAP = {
    'SERVER1': 'SERVER2', 
    'SERVER2': 'LOG_CHANNEL_ID', 
};

const ownerId = "OWNER-USERID" // Owner id can execute some commands without administrator perms

const activity = "Your bot activity here!" 

// Exporting all configurations
module.exports = {
    BOT_TOKEN,
    CLIENT_ID,
    MONGO_URI,
    EXPRESS_PORT,
    SHINY_LOG_CHANNEL_MAP,
    ownerId,
    activity
};
