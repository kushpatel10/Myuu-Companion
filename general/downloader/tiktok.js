const { spawn } = require('child_process');
const { AttachmentBuilder } = require('discord.js');
const path = require('path');

const handleTiktokCommand = async (message) => {
  const urlRegex = /(https?:\/\/(?:www\.)?(?:tiktok\.com\/@[A-Za-z0-9._-]+\/video\/[0-9]+|vm\.tiktok\.com\/[A-Za-z0-9]+\/))/;
  const match = message.content.match(urlRegex);

  if (match) {
    console.log("SENT THE MESSAGE")
    const tiktokUrl = match[0];
    const pythonScriptPath = path.join(__dirname, 'tiktok.py');

    const pythonProcess = spawn('python3', [pythonScriptPath, tiktokUrl]);

    let base64String = '';
    let errorOccurred = false;

    pythonProcess.stdout.on('data', (data) => {
      base64String += data.toString();
    });

    pythonProcess.stderr.on('data', (error) => {
      console.error(`Error from Python script: ${error.toString()}`);
      errorOccurred = true;
    });

    pythonProcess.on('close', async (code) => {
      if (code === 0 && !errorOccurred) {
        try {
          const videoBuffer = Buffer.from(base64String, 'base64');
          const attachment = new AttachmentBuilder(videoBuffer, { name: 'tiktok_video.mp4' });

          await message.reply({
            content: 'Here is the TikTok video:',
            files: [attachment],
          });

          console.log('TikTok video sent successfully!');
        } catch (err) {
          console.error('Error decoding base64 or sending video:', err);
          await message.reply('An error occurred while processing the TikTok video.');
        }
      } else {
        console.error(`Python script exited with code ${code}`);
        await message.reply('Failed to fetch the TikTok video. Please try again.');
      }
    });
  } else {
  return
  }
};

module.exports = {
  handleTiktokCommand,
};