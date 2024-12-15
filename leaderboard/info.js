const ShinyTracker = require('../mongo/shinyTracker');

module.exports = {
    data: {
        name: 'info',
        description: 'Check the number of shinies a user has found',
        options: [
            {
                type: 'USER',
                name: 'user',
                description: 'The user whose shiny count you want to check',
                required: false, 
            },
        ],
    },
    async execute(interaction) {
        try {
            
            const targetUser = interaction.options.getUser('user') || interaction.user;
            const userId = targetUser.id;
            const guildId = interaction.guildId;

            const userData = await ShinyTracker.findOne({ userId, guildId });

            if (userData) {
                const shinyCount = userData.shinyCount || 0;
                await interaction.reply({
                    content: `**${targetUser.tag}** has found **${shinyCount} shinies** in this server!`,
                    ephemeral: false, 
                });
            } else {
                await interaction.reply({
                    content: `**${targetUser.tag}** hasn't found any shinies yet. Encourage them to keep hunting!`,
                    ephemeral: false, 
                });
            }
        } catch (error) {
            console.error('Error fetching shiny info:', error);
            await interaction.reply({
                content: `An error occurred while retrieving the shiny count. Please try again later.`,
                ephemeral: true,
            });
        }
    },
};
