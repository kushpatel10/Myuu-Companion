const { TimeoutPokemon } = require('../../database/schema');

module.exports = {
    name: 'timeoutpokemonremove',
    description: 'Remove a Pokémon from your timeout list.',
    options: [
        {
            name: 'slot',
            type: 'INTEGER',
            description: 'The slot number of the Pokémon to remove (1-5).',
            required: true,
        },
    ],
    async execute(interaction) {
        
        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        const slot = interaction.options.getInteger('slot');
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        if (slot < 1 || slot > 5) {
            return interaction.reply({
                content: '❌ Invalid slot number. Please choose a slot between 1 and 5.',
            });
        }

        try {
            const userRecord = await TimeoutPokemon.findOne({ userId, guildId });

            if (!userRecord || !userRecord.pokemonList[slot - 1]) {
                return interaction.reply({
                    content: '❌ No Pokémon found in that slot.',
                });
            }

            const updatedList = [...userRecord.pokemonList];
            updatedList.splice(slot - 1, 1);

            await TimeoutPokemon.findOneAndUpdate(
                { userId, guildId },
                { $set: { pokemonList: updatedList } }
            );

            await interaction.reply({
                content: `✅ Successfully removed the Pokémon from slot ${slot}.`,
            });
        } catch (error) {
            console.error('Error removing Pokémon:', error);
            await interaction.reply({
                content: '❌ Something went wrong while removing the Pokémon.',
            });
        }
    },
};