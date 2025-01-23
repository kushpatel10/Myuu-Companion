# **Myuu-Companion**

A Discord bot designed to detect and handle specific Pokémon encounters (e.g., "Shiny" Pokémon or "Greninja-Ash") in messages from a specific bot and log these encounters in designated channels. The bot also provides additional functionality through various slash commands.

# **Whats-New**
- Custom Pokemon Timeout! (Stores the pokemon data in MongoDB)
- Reels downloader (IDK WHY)
- Pokemon Auction commands
- Added MongoDB to store the no. of shinys
- Image leaderboard for the shinys encountered using Sharp module 
- New Leaderboard commands!!
---
## **Features**
- Detects and processes messages from myuu(`id: 438057969251254293`).
- Recognizes Pokémon like "Shiny" and "Greninja-Ash" and performs actions such as:
  - Timing out users for a short duration.
  - Sending embeds with encounter details in the same channel.
  - Logging these encounters in designated channels.
- Slash commands for retrieving bot and server information:
  - `/ping` - Check the bot's ping and system information.
  - `/botinfo` - Get detailed information about the bot.
  - `/serverinfo` - Retrieve details about the current server.
  - `/can_timeout` - Check if the bot can time out a specific user.
  - `/leaderboard server`- Shows the shiny leaderboard of the server
  - `/leaderboard cleardata`- Deletes the data of shinys encountered in a server.
  - `/shiny add <user> <amount of shinys>`- Adds particular no. of shinys found in the server.
  - `/shiny remove <user> <amount>`- Removes particular no. of shinys found in the server. 
  - `/botban <user> ` - Refrains a user to use the bot commands.
  - `/removebotban <user>` - Removes the bot ban of a user.
  - `/info <user>` - Shows Custom Pokemon Timeout list!
  - `/timeoutpokemon add <pokemon>` - Adds the pokemon in timeout list (Will timeout you when encountered)!
  - `/timeoutpokemon remove <slot no.>` - Removes the pokemon from the timeout list!
  - `/routecount` - Shows your routecount! (It will reset if a shiny is found)
  - New auction commands added too 😉! (Took me a lot of time to complete)

---

# **Known-Issues**

- Rate limits are not handled.
- Some functions deprecated in Discord.js v14 are still present in the bot. As a result, certain commands might stop working in the future due to this.
- Embed-based `mypkinfo` is not implemented for auctions.  
- Some bugs exist, such as:
  - If the channel of an existing auction is deleted, the bot crashes. (A `catch` block needs to be added to handle this. You can contribute to fix this.)  
  - Need to add catchblocks somewhere so the bot dont crash.
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
  Streamlined interfaces and better command handling for seamless usability. (Like help command and blah blah)

---

Want to suggest a feature? Open an [issue](#) or contribute your ideas via pull requests!

---

## **Setup and Installation**

### **Requirements**
- [Node.js](https://nodejs.org/) v16 or later
- [Discord.js](https://discord.js.org/) v14
- A Discord bot token
- A configured `config.js` file

### **Installation Steps**
1. **Clone the Repository**
   ```bash
   git clone https://github.com/kushpatel10/Myuu-Companion.git
   cd Myuu-Companion
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
4.`node index.js`

---

## **License**

This project is licensed under the [Creative Commons Legal Code CC0 1.0 Universal (Public Domain Dedication)](https://creativecommons.org/publicdomain/zero/1.0/)

---

## **Credits**

- **Myself 😅**: For creating this awesome bot!
- **ChatGPT**: For prettifying the code , and crafting this README.
- **Discord.js Community**: For providing an amazing library and resources to create Discord bots.
- **Inspiration**: From the [Myuu-Anti-Shiny-Discord-Bot](https://github.com/SomeRandomGuy009/Myuu-Anti-Shiny-Discord-Bot).

---
