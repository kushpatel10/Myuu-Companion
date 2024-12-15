const { createShinyLeaderboardEmbed, createGithubUrlButton, createNoPermissionEmbed } = require('../embed/mainembeds');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { AttachmentBuilder, PermissionsBitField } = require('discord.js');
const ShinyTracker = require('../mongo/shinyTracker');
const { ownerId } = require('../config.js');

module.exports = {
    name: 'server',
    description: 'Generate a leaderboard for shiny counts in the server.',
    async execute(interaction) {

        if (!interaction.guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        const isOwner = interaction.user.id === ownerId;
        if (!isOwner && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const noPermissionEmbed = createNoPermissionEmbed();
            await interaction.reply({ embeds: [noPermissionEmbed] });
            return;
        }

        await interaction.deferReply();

        try {
            const guildId = interaction.guild.id;

            const shinyData = await ShinyTracker.find({ guildId }).sort({ shinyCount: -1 }).limit(10);

            const leaderboard = await Promise.all(
                shinyData.map(async (data, index) => {
                    const username = await interaction.guild.members
                        .fetch(data.userId)
                        .then((member) => member.user.username)
                        .catch(() => 'Unknown User');
                    return { rank: index + 1, username, shinyCount: data.shinyCount };
                })
            );

            const userId = interaction.user.id;
            const allShinyData = await ShinyTracker.find({ guildId }).sort({ shinyCount: -1 });
            const userRankData = allShinyData.findIndex((entry) => entry.userId === userId);
            const userRank = userRankData >= 0
                ? { rank: userRankData + 1, shinyCount: allShinyData[userRankData].shinyCount }
                : null;

            const inputImagePath = path.join(__dirname, '../leaderboard/image.png');
            const outputImagePath = path.join(__dirname, '../leaderboard/output.png');

            const metadata = await sharp(inputImagePath).metadata();
            const imageWidth = metadata.width;
            const imageHeight = metadata.height;
//Dont change anything here (It will result in bad formatting of the leaderboard image)
            const svgTexts = leaderboard.map((entry, index) => {
                const y = 25 + index * 42; 
                return `
                    <text x="75" y="${y}" font-family="Arial" font-size="16" font-weight="bold" fill="white">
                        ${entry.username}
                    </text>
                    <text x="327" y="${y}" font-family="Arial" font-size="16" font-weight="bold" fill="white">
                        ${entry.shinyCount}
                    </text>
                `;
            });

            const svgOverlay = `
                <svg width="${imageWidth}" height="${imageHeight}">
                    ${svgTexts.join('')}
                </svg>
            `;
            await sharp(inputImagePath)
                .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
                .toFile(outputImagePath);

            const leaderboardImage = new AttachmentBuilder(outputImagePath);

            const embed = createShinyLeaderboardEmbed(userRank || { rank: 'N/A', shinyCount: 0 }, interaction.user, leaderboard);

            await interaction.editReply({
                embeds: [embed],
                files: [leaderboardImage],
                components: [{ type: 1, components: [createGithubUrlButton()] }],
            });

            fs.unlinkSync(outputImagePath);
        } catch (error) {
            console.error('Error generating leaderboard:', error);
            await interaction.editReply({
                content: 'An error occurred while generating the leaderboard. Please try again later.',
            });
        }
    },
};