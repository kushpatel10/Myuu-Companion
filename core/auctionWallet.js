const Wallet = require('../mongo/walletSchema');

module.exports.handleWalletEmbed = async (message, client) => {
    try {
        for (const embed of message.embeds) {
            const walletuserid = message.interaction?.user?.id
            const walletuserfetch = await client.users.fetch(walletuserid)
            const walletusertag = walletuserfetch.tag+'#0'

            if (embed.author.name === walletusertag && embed.fields && embed.fields.length > 0) {
                const embedValue = embed.fields[0].value;
                const lines = embedValue.split("\n");

                for (const line of lines) {
                    if (line.includes("Poké Coins")) {
                        const amount = parseInt(line.split("**")[1].replace(/,/g, "").trim(), 10);

                        const userId = message.interaction?.user?.id || "Unknown";
                        const username = message.interaction?.user?.username || "Unknown";

                        await Wallet.findOneAndUpdate(
                            { userId },
                            { username, coins: amount, updatedAt: new Date() },
                            { upsert: true, new: true }
                        );
                        console.log(`Updated wallet for ${username} (${userId}): ${amount} coins`);
                        return;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error handling wallet embed:', error);
    }
};
