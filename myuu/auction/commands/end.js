const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { endAuction } = require('../handlers/auctionHandler');
const { Auction } = require("../../../database/schema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auction')
        .setDescription('End a running auction.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End the current auction in the channel')),

    async execute(interaction) {

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

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: 'You are not an administrator.',
                ephemeral: true,
            });
        }

        await endAuction(interaction.client, channel.id, auctionData);
        interaction.reply({
            content: `Auction ended successfully.`,
        });
    },
};