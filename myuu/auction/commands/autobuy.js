const { SlashCommandBuilder } = require('discord.js');
const { autobuy } = require('../handlers/auctionHandler');
const {Auction} = require('../../../database/schema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auction')
        .setDescription('Activate autobuy for the current auction.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('autobuy')
                .setDescription('Confirm autobuy for the ongoing auction')),

    async execute(interaction, client) {

        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }
        
        const user = interaction.user;
        const channel = interaction.channel;

        const auctionData = await Auction.findOne({ channelId: channel.id });

        if (!auctionData) {
            return interaction.reply({
                content: 'No active auction found in this channel.',
                ephemeral: true,
            });
        }

        if (auctionData.isEnded) {
            return interaction.reply({
                content: 'This auction has already ended.',
                ephemeral: true,
            });
        }

        await autobuy(client, interaction);
    },
};