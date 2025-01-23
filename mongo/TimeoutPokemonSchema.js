const mongoose = require('mongoose');

const timeoutPokemonSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    pokemonList: { type: [String], default: [] }, // Array of Pokémon names
});

module.exports = mongoose.model('TimeoutPokemon', timeoutPokemonSchema);
