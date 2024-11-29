const { EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const os = require('os'); 

function createPingEmbed(client) {
    const totalMemory = os.totalmem() / (1024 * 1024 * 1024); 
    const freeMemory = os.freemem() / (1024 * 1024 * 1024); 
    const usedMemory = totalMemory - freeMemory;

    const uptime = process.uptime(); 
    const uptimeFormatted = new Date(uptime * 1000).toISOString().substr(11, 8);

    return new EmbedBuilder()
        .setTitle('Bot Ping & System Info')
        .setThumbnail(client.user.displayAvatarURL())        
        .setDescription(`
            🏓 **Latency**: ${client.ws.ping}ms
            💻 **Uptime**: ${uptimeFormatted}
            💾 **Total RAM**: ${totalMemory.toFixed(2)} GB
            💾 **Used RAM**: ${usedMemory.toFixed(2)} GB
            💾 **Free RAM**: ${freeMemory.toFixed(2)} GB
        `)
        .setColor('#574AA2');
}

function createBotInfoEmbed(client) {
    const embed = new EmbedBuilder()
        .setColor('#574AA2') 
        .setThumbnail(client.user.displayAvatarURL())
        .setTitle(`${client.user.username} Bot Info`)
        .setDescription(`
            🤖 **Bot Name**: ${client.user.username}
            👤 **Bot Developer**: <@714036359135756360>
            🌍 **Servers**: ${client.guilds.cache.size}
            🔧 **Node.js Version**: ${process.version}
            ⚡ **Discord.js Version**: ${require('discord.js').version}
            🖥️ **OS**: ${os.platform()} ${os.release()}
        `)
        .setTimestamp();

    return embed;
}

function createServerInfoEmbed(guild, owner) {
    return new EmbedBuilder()
        .setTitle(`${guild.name} Server Info`)
        .setThumbnail(guild.iconURL())
        .setDescription(`
            🏰 **Server Name**: ${guild.name}
            👑 **Server Owner**: ${owner.user.tag}
            👥 **Members**: ${guild.memberCount}
            🌍 **Region**: ${guild.preferredLocale}
            🎮 **Created At**: ${guild.createdAt.toDateString()}
        `)
        .setColor('#574AA2')
        .setTimestamp();
}

function createCanTimeoutEmbed(canTimeout, targetUser) {
    return new EmbedBuilder()
        .setTitle('Timeout Check')
        .setDescription(canTimeout 
            ? `Yes, the bot **can** timeout **${targetUser.tag}**.`
            : `No, the bot **cannot** timeout **${targetUser.tag}**.`)
        .setColor('#574AA2')
        .setTimestamp();
}

function createShinyEmbed(guildMember, messageUrl) {
    return new EmbedBuilder()
        .setTitle(`${guildMember.user.username} Just Found a ★ Shiny!!`)
        .setDescription('Congratulations!. Catch it ASAP!!\nPlease press this -> </throw:1033315381890256930> <- to throw a ball quickly.')
        .setAuthor({ name: 'Shiny Tracker', iconURL: guildMember.displayAvatarURL({ dynamic: true }) })
        .setColor('#574AA2')
        .setTimestamp()
        .setFooter({ text: 'Make sure to star the github repository 🤬', iconURL: guildMember.displayAvatarURL({ dynamic: true }) })
        .setURL(messageUrl);
}

function createGreninjaEmbed(guildMember, messageUrl) {
    return new EmbedBuilder()
        .setTitle(`${guildMember.user.username} Just Found a Greninja-Ash!!`)
        .setDescription('Congratulations!. Catch it ASAP!!\nPlease press this -> </throw:1033315381890256930> <- to throw a ball quickly.')
        .setAuthor({ name: 'Shiny Tracker', iconURL: guildMember.displayAvatarURL({ dynamic: true }) })
        .setColor('#574AA2')
        .setTimestamp()
        .setFooter({ text: 'Make sure to star the github repository 🤬', iconURL: guildMember.displayAvatarURL({ dynamic: true }) })
        .setURL(messageUrl);
}

function createLogEmbed(originalEmbed) {
    const logEmbed = new EmbedBuilder()
        .setTitle(originalEmbed?.author?.name)
        .setDescription(originalEmbed.description)
        .setColor('#574AA2')
        .setTimestamp()
        .setFooter({ text: 'Make sure to star the github repository 🤬', iconURL: originalEmbed.footer?.iconURL });

    const imageUrl = originalEmbed?.image?.url;
    if (imageUrl) {
        logEmbed.setImage(imageUrl);
    }

    return logEmbed;
}

function createShinyButton(messageUrl) {
    return new ButtonBuilder()
        .setLabel('Go to Message')
        .setStyle(ButtonStyle.Link)
        .setURL(messageUrl);
}

function createGithubUrlButton(){
    return new ButtonBuilder()
    .setLabel('Github Repository')
    .setStyle(ButtonStyle.Link)
    .setURL('https://github.com/kushpatel10/Myuu-Companion');
}

function createNoPermissionEmbed() {
    return new EmbedBuilder()
        .setTitle('Skill Issues')
        .setDescription('Boohoo **nigga!** skill issues for you! womp womp!!')
        .setFooter({text:'Get the admin perms to use this command!'})
        .setColor('#2B2D31');
}

function createConfirmClearEmbed() {
    return new EmbedBuilder()
        .setTitle('Are you sure?')
        .setDescription('Click **Yes** to clear all shiny data in the server or **No** to cancel.')
        .setColor('#FF0000');
}

function createClearSuccessButton() {
    return new ButtonBuilder()
        .setCustomId('clear_yes')
        .setLabel('Yes')
        .setStyle('Success');
}

function createClearCancelButton() {
    return new ButtonBuilder()
        .setCustomId('clear_no')
        .setLabel('No')
        .setStyle('Danger');
}

function createShinyLeaderboardEmbed(userRank, user, leaderboardImage) {
    const userRankMessage = userRank
        ? `Your shiny encounter rank is **#${userRank.rank}** with **${userRank.shinyCount}** shinies.`
        : `You haven't encountered any shinies yet!`;

    return new EmbedBuilder()
        .setTitle('Shiny Leaderboard of the Server!')
        .setDescription(`${userRankMessage}`)
        .setColor('#574AA2')
        .setImage('attachment://output.png')  
        .setTimestamp()
        .setFooter({ text: `Make sure to star the github repository 🤬`, iconURL: user.displayAvatarURL() });
}

module.exports = {
    createBotInfoEmbed,
    createServerInfoEmbed,
    createCanTimeoutEmbed,
    createShinyEmbed,
    createGreninjaEmbed,
    createLogEmbed,
    createShinyButton,
    createPingEmbed,
    createGithubUrlButton,
    createNoPermissionEmbed,
    createClearCancelButton,
    createClearSuccessButton,
    createConfirmClearEmbed,
    createShinyLeaderboardEmbed,
};
