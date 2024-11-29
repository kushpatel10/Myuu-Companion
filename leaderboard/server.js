const { createShinyLeaderboardEmbed , createGithubUrlButton , createNoPermissionEmbed } = require('../embed/mainembeds');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { AttachmentBuilder, PermissionsBitField  } = require('discord.js');
const ShinyTracker = require('../mongo/shinyTracker');
const {ownerId} = require('../config.js')

module.exports = {
    name: 'server',
    description: 'Generate a leaderboard for shiny counts in the server.',
    async execute(interaction) {
        const isOwner = interaction.user.id === ownerId;
        if (!isOwner && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))  {
             const noPermissionEmbed = createNoPermissionEmbed();
            await interaction.reply({ embeds: [noPermissionEmbed]});
            return;
        }
        
        await interaction.deferReply();

        try {
            const guildId = interaction.guild.id;
            const shinyData = await ShinyTracker.find({ guildId })
                .sort({ shinyCount: -1 })
                .limit(10);

            const leaderboard = [];
            for (let i = 0; i < 10; i++) {
                const data = shinyData[i];
                if (data) {
                    const username = await interaction.guild.members
                        .fetch(data.userId)
                        .then((member) => member.user.username)
                        .catch(() => 'Unknown User');
                    leaderboard.push({ username, shinyCount: data.shinyCount });
                } else {
                    leaderboard.push({ username: 'N/A', shinyCount: 0 });
                }
            }

            const userId = interaction.user.id;
            const allShinyData = await ShinyTracker.find({ guildId }).sort({ shinyCount: -1 });
            const userRankData = allShinyData.findIndex((entry) => entry.userId === userId);
            const userRank = userRankData >= 0 ? { rank: userRankData + 1, shinyCount: allShinyData[userRankData].shinyCount } : null;

            const inputImagePath = path.join(__dirname, '../leaderboard/image.png');
            const outputImagePath = path.join(__dirname, '../leaderboard/output.png');

            const metadata = await sharp(inputImagePath).metadata();
            const imageWidth = metadata.width;
            const imageHeight = metadata.height;

            const svgTexts = leaderboard.map((entry, index) => {
                const y = 25 + index * 42; 
                const fontPath = path.join('./Arial.ttf');
                return `
                    <text x="75" y="${y}" font-family="sans-serif" font-size="16" font-weight="bold" fill="white">
                        ${entry.username}
                    </text>
                    <text x="327" y="${y}" font-family="sans-serif" font-size="16" font-weight="bold" fill="white">
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

            const embed = createShinyLeaderboardEmbed(userRank, interaction.user, leaderboardImage);

            await interaction.editReply({ embeds: [embed] , files: [leaderboardImage] , components: [{ type: 1, components: [createGithubUrlButton()] }] });

            fs.unlinkSync(outputImagePath); 
        } catch (error) {
            console.error('Error generating leaderboard:', error);
            await interaction.editReply({
                content: 'An error occurred while generating the leaderboard. Please try again later.',
            });
        }
    },
};
