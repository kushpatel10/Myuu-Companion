# **FrostyBot: A multipurpose Discord Bot for FrostyCord**

ForstyBot is a feature-packed Discord bot originally designed for **FrostyCord** but now upgraded with a variety of useful functions, ranging from Pokémon encounter logging to content downloading from YouTube Shorts, Instagram Reels, and TikTok. Plus, it brings some fun to your server with Markov Chains to generate random, humorous sentences.

# **Whats-New**
- **Multipurpose Bot**: Expanded to support social media content downloading (YouTube Shorts, Instagram Reels, and TikTok).
- **Markov Chain Fun**: Generates random funny sentences based on chat input.
- **MongoDB Integration**: Tracks shiny Pokémon encounters in a database.
- **Reworked File Structure**: Optimized the bot's file structure for better performance.
- **New Slash Commands**: Includes new downloader and fun commands.
---
## **Features**

### **Myuu Utility Commands**  
- Detects "Shiny" Pokémon and special forms like "Greninja-Ash" and reacts accordingly.
- Logs encounters to a dedicated channel.
- Sends embed messages with encounter details and has timeout functionalities for specific users.
- Custom pokemon timeout.
- Shiny encountered leaderboard and routecount
- Myuu pokemon auctions.
  
### **Markov Chains**  
- Generates random, funny sentences in chat using Markov Chains to keep the conversation lively.
- Uses **Trigrams** to create more logical sentence structures.
- Trained on the chat that happens in the channel.

### **Social Media Downloaders**  
- **YouTube Shorts**: Downloads YouTube Shorts videos directly. (This one is a bit unreliable and breaks frequently)
- **Instagram Reels**: Save Instagram Reels with ease.
- **TikTok**: Downloads TikTok videos.

### **Utility**
- Slash commands!
- And much more!!!
---

# **Known-Issues**

- Rate limits are not handled.
- Some functions deprecated in Discord.js v14 are still present in the bot. As a result, certain commands might stop working in the future due to this.
- Embed-based `mypkinfo` is not implemented for auctions.  
- Some bugs exist, such as:
  - If the channel of an existing auction is deleted, the bot crashes. (A `catch` block needs to be added to handle this. You can contribute to fix this.)  
  - Need to add catchblocks somewhere so the bot dont crash.
- The YouTube Shorts downloader breaks frequently when the code is hosted on a non-residential instance , so I use TOR proxy, though its slow!
---

## **Contributing**

Contributions are warmly welcomed! If you’d like to contribute to this project, here’s how you can help:

1. **Report Bugs**: Found an issue? Open an [issue](#) on GitHub and describe the problem in detail.
2. **Request Features**: Have an idea for improvement? Open an [issue](#) and share your thoughts.
3. **Submit Pull Requests**: If you have coding skills, fork the repository, make your changes, and submit a pull request for review.
4. **Testing and Feedback**: Test the bot, explore edge cases, and share your feedback to help improve it.
5. **Documentation**: Spot an error or think of a way to enhance the documentation? Contributions to the README or comments in the code are also appreciated.

### **Guidelines**

- Follow the existing coding style and structure.
- Test your changes thoroughly before submitting.
- Write clear commit messages and describe your changes in pull requests.
- Be respectful and kind in your interactions with other contributors.
  
---

## **Upcoming Features**

Exciting updates are in the works! Here's what you can expect in the next version of this bot:

- **User-Friendly Updates**  
  Streamlined interfaces and improved command handling for seamless usability (probably including a help command).

- **And Much More!**  
  Im continuously brainstorming and iterating to bring more exciting features. Stay tuned!

---

Want to suggest a feature? Open an [issue](#) or contribute your ideas via pull requests!

---

## **Setup and Installation**

### **Requirements**
- [Node.js](https://nodejs.org/) v18 or later
- [Discord.js](https://discord.js.org/) v14
- A Discord bot token
- A TOR proxy
- A configured `config.js` file

### **Installation Steps**
1. **Clone the Repository**
   ```bash
   git clone https://github.com/kushpatel10/myuu-companion.git
   cd Myuu-companion
2. ***Download Dependencies***
   `npm install`
3. Set Up Configuration Create a config.js file in the root directory with the following structure:
   ```bash 
    module.exports = {
    BOT_TOKEN: 'YOUR_BOT_TOKEN',
    CLIENT_ID: 'YOUR_CLIENT_ID',
    EXPRESS_PORT: 3000, // Optional: Change the port for the express server
    SHINY_LOG_CHANNEL_MAP: {
        // Map guild IDs to log channel IDs
        'GUILD_ID_1': 'CHANNEL_ID_1',
        'GUILD_ID_2': 'CHANNEL_ID_2',
    }}
4. TOR Proxy and Cookies Setup
  - You need to have a **TOR** proxy running for the YouTube Shorts downloader to work.
  - Additionally, you must fill in `general/downloader/cookies.txt` for YouTube Shorts to function correctly.
5.`node index.js`

^^ **If you have any issues setting up the bot, feel free to DM me on Discord. My username is ghoul.js**
---

## **License**

This project is licensed under the [Creative Commons Legal Code CC0 1.0 Universal (Public Domain Dedication)](https://creativecommons.org/publicdomain/zero/1.0/)

---

## **Credits**

- **Myself 😅**: For creating this awesome bot!
- **ChatGPT**: For prettifying the code, markov chains algorithm, and crafting this README.
- **Discord.js Community**: For providing an amazing library and resources to create Discord bots.
- **Inspiration**: From the [Myuu-Anti-Shiny-Discord-Bot](https://github.com/SomeRandomGuy009/Myuu-Anti-Shiny-Discord-Bot).
- **Markov Chains**: Logic for sending messages generated by Markov Chains (originally by [knownasbot](https://github.com/knownasbot/markov-bot))

---
