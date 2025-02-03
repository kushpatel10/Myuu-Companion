const { MarkovSettings, MarkovMessage } = require('../../database/schema');

module.exports = {
    async setChannel(interaction) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        
        const guildId = interaction.guildId;
        const channelId = interaction.channelId;

        await MarkovSettings.findOneAndUpdate(
            { guildId },
            { $addToSet: { channels: channelId } },
            { upsert: true }
        );
        
        interaction.reply("✅ Markov tracking enabled for this channel!");
    },

    async removeChannel(interaction) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        
        const guildId = interaction.guildId;
        const channelId = interaction.channelId;

        await MarkovSettings.findOneAndUpdate(
            { guildId },
            { $pull: { channels: channelId } }
        );

        interaction.reply("✅ Markov tracking removed from this channel!");
    },

    async messageCount(interaction) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        
        const count = await MarkovMessage.countDocuments({ channelId: interaction.channelId });
        interaction.reply(`📊 Messages stored: ${count}`);
    },

    async enableMarkov(interaction) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        
       const mode = interaction.options.getString('mode') || 'random';
       const enableMarkov = await MarkovSettings.findOneAndUpdate(
            { guildId: interaction.guildId },
            { enabled: true, mode: mode },
            { upsert: true }
        );
        interaction.reply(`✅ Markov bot enabled in **${enableMarkov.mode}** mode!`);
    },

    async disableMarkov(interaction) {
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        
        await MarkovSettings.findOneAndUpdate(
            { guildId: interaction.guildId },
            { enabled: false }
        );
        interaction.reply("🚫 Markov bot disabled!");
    }
};
