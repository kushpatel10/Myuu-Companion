const { MarkovMessage, MarkovSettings } = require('../../database/schema');
const AdvancedMarkovChains = require('./markovAlgorithm');
const { WebhookClient } = require('discord.js');

const cooldowns = new Map();

async function fetchMessages(guildId, channelId, mode) {
    if (mode === "precise") {
        return await MarkovMessage.find({ guildId, channelId }).sort({ _id: -1 }).limit(2500);
    } else { 
        const count = await MarkovMessage.countDocuments({ guildId, channelId });
        const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, count - 1500)));
        return await MarkovMessage.find({ guildId, channelId }).skip(skip).limit(1500);
    }
}

async function handleMessage(client, message) {
    if (message.author.bot || !message.content) return;

    const settings = await MarkovSettings.findOne({ guildId: message.guild.id });
    if (!settings || !settings.channels.includes(message.channel.id)) return;

    await MarkovMessage.create({
        guildId: message.guild.id,
        channelId: message.channel.id,
        message: message.content,
        authorId: message.author.id
    });
    
    if (!settings.enabled) return;

    const lastMessageTime = cooldowns.get(message.guild.id) || 0;
    if (Date.now() - lastMessageTime < 15000) return;
    if (Math.random() > 0.20) return; // 20% chance to respond

    const mode = settings.mode === "precise" ? "precise" : "random"; // Default to "random"
    const messages = await fetchMessages(message.guild.id, message.channel.id, mode);

    if (messages.length < 12) return;

    const markov = new AdvancedMarkovChains(3);
    markov.generateDictionary(messages.map(msg => msg.message));

    const response = markov.generateChain(20);
    if (!response) return;

    cooldowns.set(message.guild.id, Date.now());

    if (settings.webhook) {
        const webhookClient = new WebhookClient({ url: settings.webhook });
        await webhookClient.send(response);
    } else {
        await message.channel.sendTyping();
        setTimeout(() => message.channel.send(response), Math.floor(5000 + Math.random() * 5000));
    }
}

module.exports = { handleMessage };
