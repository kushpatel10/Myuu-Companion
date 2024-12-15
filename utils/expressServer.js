const express = require('express');

const app = express();
const PORT = 8000; 

app.get('/', (req, res) => {
    res.send(`
        <h1>Bot is Running!</h1>
        <p>Visit your Discord server to interact with the bot.</p>
    `);
});

function startServer(client) {
    app.listen(PORT, () => {
        console.log(`Express server is running on http://localhost:${PORT}`);
        client.user.setActivity("Online and Ready", { type: "PLAYING" });
    });
}

module.exports = startServer;
