const TimeoutPokemon = require('../mongo/TimeoutPokemonSchema');

module.exports = {
    name: 'timeoutpokemonadd',
    description: 'Add a Pokémon to your timeout list.',
    options: [
        {
            name: 'pokemon',
            type: 'STRING',
            description: 'The Pokémon name to add.',
            required: true,
        },
    ],
    async execute(interaction) {

        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        
        const pokemonName = interaction.options.getString('pokemon');
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        try {
            const userRecord = await TimeoutPokemon.findOne({ userId, guildId });

            if (userRecord && userRecord.pokemonList.length >= 5) {
                return interaction.reply({
                    content: '❌ You already have 5 Pokémon in your timeout list. Remove one to add another.',
                });
            }

            await TimeoutPokemon.findOneAndUpdate(
                { userId, guildId },
                { $push: { pokemonList: pokemonName } },
                { upsert: true, new: true }
            );

            await interaction.reply({
                content: `✅ Successfully added **${pokemonName}** to your timeout list!`,
            });
        } catch (error) {
            console.error('Error adding Pokémon:', error);
            await interaction.reply({
                content: '❌ Something went wrong while adding the Pokémon.',
            });
        }
    },
};
