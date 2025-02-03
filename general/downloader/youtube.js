const { spawn } = require("child_process");
const { AttachmentBuilder } = require('discord.js'); 

const handleYoutubeShortsCommand = async (message) => {
  try {
    const urlRegex = /(https?:\/\/(?:www\.)?youtube\.com\/shorts\/[A-Za-z0-9_-]+)/;
    const match = message.content.match(urlRegex);

    if (match) {
      const videoURL = match[0];
      const cdnUrl = await getCdnUrl(videoURL);

      if (cdnUrl) {
        const videoStream = await fetch(cdnUrl);
        const videoAttachment = new AttachmentBuilder(videoStream.body, { name: 'youtube_video.mp4' });
        await message.reply({ content: 'Here is the Youtube video:', files: [videoAttachment] });
      } else {
        await message.reply('Sorry, I couldn\'t fetch the video URL.');
      }
    } else {
      return; 
    }
  } catch (error) {
    console.error(error);
    await message.reply('There was an error while fetching the video.');
  }
};

const getCdnUrl = (videoURL) => {
  return new Promise((resolve, reject) => {
    const command = spawn('yt-dlp', [
      '--proxy', 'socks5://127.0.0.1:9050', // You can disable this if your hosting has a residential IP, I guess? or you have to use TOR 
      '--no-check-certificate',// Fix certificate issues
      '--cookies', '/home/ec2-user/pizza/general/downloader/cookies.txt', // You can disable this if your hosting has a residential IP
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      '--get-url', '-f', 'best', videoURL
    ], {
      cwd: '/home/ec2-user/pizza/general/downloader', // Ensure this is the right directory. You have to change this btw!
    });

    let output = "";
    
    command.stdout.on('data', (data) => {
      output += data.toString();
    });

    command.stderr.on('data', (data) => {
      const message = data.toString().trim();
      
      if (message.includes("WARNING: \"-f best\" selects the best pre-merged format")) {
        return; 
      }

      console.error(`Error: ${message}`);
      reject(new Error(message)); 
    });

    command.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`yt-dlp process exited with code ${code}`));
      } else {
        resolve(output.trim());
      }
    });
  });
};

module.exports = {
  handleYoutubeShortsCommand,
};
