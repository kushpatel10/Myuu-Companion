// utils/commands.js
const { SlashCommandBuilder } = require('discord.js');

// Auction Command Structure
const slashcommands = [
    new SlashCommandBuilder()
      .setName('reel')
      .setDescription('Fetch and display an Instagram reel')
      .addStringOption((option) =>
      option
         .setName('link')
         .setDescription('The link to the Instagram reel')
         .setRequired(true)
 )
 .toJSON(),
   new SlashCommandBuilder()
       .setName('shiny')
       .setDescription('Manage shiny counts')
       .addSubcommand((subcommand) =>
           subcommand
               .setName('add')
               .setDescription('Add shinies to a user')
               .addUserOption((option) =>
                   option.setName('user').setDescription('The user to add shinies to').setRequired(true)
               )
               .addIntegerOption((option) =>
                   option.setName('amount').setDescription('Number of shinies to add').setRequired(true)
               )
       )
       .addSubcommand((subcommand) =>
           subcommand
               .setName('remove')
               .setDescription('Remove shinies from a user')
               .addUserOption((option) =>
                   option.setName('user').setDescription('The user to remove shinies from').setRequired(true)
               )
               .addIntegerOption((option) =>
                   option.setName('amount').setDescription('Number of shinies to remove').setRequired(true)
               )
       )
       .toJSON(),
   new SlashCommandBuilder().setName('ping').setDescription('Check the bot\'s ping, uptime, and system info').toJSON(),
   new SlashCommandBuilder().setName('botinfo').setDescription('Get information about the bot').toJSON(),
   new SlashCommandBuilder().setName('serverinfo').setDescription('Get information about the server').toJSON(),
   new SlashCommandBuilder()
       .setName('can_timeout')
       .setDescription('Check if the bot can timeout a specific user')
       .addUserOption((option) => option.setName('user').setDescription('The user to check (defaults to you)'))
       .toJSON(),
   new SlashCommandBuilder()
       .setName('info')
       .setDescription('Check the number of shinies you have found')
       .addUserOption((option) =>
           option.setName('user').setDescription('The user whose shiny count you want to check')
       )
       .toJSON(),
   new SlashCommandBuilder()
       .setName('leaderboard')
       .setDescription('Manage leaderboard data')
       .addSubcommand((subcommand) =>
           subcommand.setName('cleardata').setDescription('Clear leaderboard data')
       )
       .addSubcommand((subcommand) =>
           subcommand.setName('server').setDescription('Generate the server shiny leaderboard')
       )
       .toJSON(),
   new SlashCommandBuilder()
       .setName('routecount')
       .setDescription('Check the route count of a user')
       .addUserOption((option) =>
           option.setName('user').setDescription('The user to check route count for (defaults to yourself)')
       )
       .toJSON(),
   new SlashCommandBuilder()
       .setName('botban')
       .setDescription('Ban a user from using the bot (Admin only)')
       .addUserOption((option) =>
           option.setName('user').setDescription('The user to ban').setRequired(true)
       )
       .toJSON(),
   new SlashCommandBuilder()
       .setName('removebotban')
       .setDescription('Unban a user from using the bot (Admin only)')
       .addUserOption((option) =>
           option.setName('user').setDescription('The user to unban').setRequired(true)
       )
       .toJSON(),
       new SlashCommandBuilder()
   .setName('auction')
   .setDescription('Manage Pokémon auctions')
   .addSubcommand(subcommand =>
       subcommand
           .setName('start')
           .setDescription('Start an auction')
           .addIntegerOption(option => option.setName('time').setDescription('Auction duration in hours').setRequired(true))
           .addIntegerOption(option => option.setName('initialbid').setDescription('Staring bid amount').setRequired(true))
           .addIntegerOption(option => option.setName('autobuy').setDescription('Autobuy price').setRequired(true))
           .addIntegerOption(option => option.setName('interval').setDescription('Bid interval').setRequired(true))
   )
   .addSubcommand(subcommand =>
       subcommand
           .setName('bid')
           .setDescription('Place a bid in an active auction')
           .addIntegerOption(option => option.setName('amount').setDescription('Amount to bid').setRequired(true))
   )
   .addSubcommand(subcommand =>
       subcommand
           .setName('autobuy')
           .setDescription('Use autobuy to win the auction')
   )
   .addSubcommand(subcommand =>
       subcommand
           .setName('end')
           .setDescription('End the auction manually')
   )
   .toJSON(),
   new SlashCommandBuilder()
.setName('timeoutpokemon')
.setDescription('Manage your timeout Pokémon list')
.addSubcommand((subcommand) =>
   subcommand
       .setName('add')
       .setDescription('Add a Pokémon to your timeout list')
       .addStringOption((option) =>
           option.setName('pokemon')
               .setDescription('The Pokémon name to add')
               .setRequired(true)
       )
)
.addSubcommand((subcommand) =>
   subcommand
       .setName('remove')
       .setDescription('Remove a Pokémon from your timeout list')
       .addIntegerOption((option) =>
           option.setName('slot')
               .setDescription('The slot number of the Pokémon to remove (1-5)')
               .setRequired(true)
       )
)
.toJSON(),
    new SlashCommandBuilder()
    .setName('enablemarkov')
    .setDescription('Enable Markov bot')
    .addStringOption(option =>
        option
            .setName('mode')
            .setDescription('Choose the Markov mode')
            .setRequired(false)
            .addChoices(
                { name: 'Random', value: 'random' },
                { name: 'Precise', value: 'precise' }
            )
    )
    .toJSON(),
    new SlashCommandBuilder().setName('setchannel').setDescription('Enable Markov tracking in this channel').toJSON(),
    new SlashCommandBuilder().setName('removechannel').setDescription('Disable Markov tracking in this channel').toJSON(),
    new SlashCommandBuilder().setName('messagecount').setDescription('Check stored message count').toJSON(),
    new SlashCommandBuilder().setName('disablemarkov').setDescription('Disable Markov bot').toJSON(),
    
];

module.exports = {
    slashcommands
};
