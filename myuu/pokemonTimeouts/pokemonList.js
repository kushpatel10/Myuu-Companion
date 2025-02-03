const {ShinyTracker, TimeoutPokemon} = require('../../database/schema');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'info',
        description: 'Check the custom pokemon timeout list , shinies encountered and routecount!',
        options: [
            {
                type: 'USER',
                name: 'user',
                description: 'The user whose info you want to check',
                required: false, 
            },
        ],
    },
    
    async execute(interaction) {
        
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        const guildId = interaction.guild.id;
        const user = interaction.options.getUser('user') || interaction.user;
        const userId = interaction.options.getUser('user')?.id || interaction.user.id;

        try {
            const userAvatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });

            const userRecord = await TimeoutPokemon.findOne({ userId, guildId });
            const pokemonList = userRecord ? userRecord.pokemonList : [];

            const userData = await ShinyTracker.findOne({ userId, guildId });
            const shinyCount = userData ? userData.shinyCount || 0 : 0;
            const routeCount = userData ? userData.routeCount || 0 : 0;

            const formattedPokemonList = Array.from({ length: 5 }, (_, index) => {
              const pokemonName = pokemonList[index]; 
              return `**Slot ${index + 1}:** ${pokemonName || 'null'}`; 
              }).join('\n');
            const embed = new EmbedBuilder()
                .setColor('#574AA2')
                .setTitle(`Info`)
                .setDescription(`**${user.tag}'s Pokémon Timeout List:**\n\n${formattedPokemonList}\n\n`)
                .addFields(
                    { name: 'Shiny Found', value: `${shinyCount}`, inline: true },
                    { name: 'Route Count', value: `${routeCount}`, inline: true }
                )
                .setThumbnail(userAvatarUrl)
                .setFooter({ text: 'Note: The Pokémon name must be capitalized as it appears in\nMyuu embeds, i.e., Charmander and not charmander.' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching Pokémon list:', error);
            await interaction.reply({
                content: '❌ Something went wrong while fetching your Pokémon list.',
            });
        }
    },
};