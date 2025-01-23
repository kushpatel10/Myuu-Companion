const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const normalizeInstagramUrl = (url) => {
  return url.replace('/reels/', '/reel/');
};

const resolveInstagramRedirect = async (url) => {
  url = normalizeInstagramUrl(url);

  try {
    const response = await fetch(url, { redirect: 'follow' });
    const finalUrl = response.url;

    if (finalUrl.includes('instagram.com/reel/')) {
      const regex = /instagram.com\/reel\/([A-Za-z0-9-_]+)/;
      const match = finalUrl.match(regex);
      return match ? match[1] : null; 
    }

    return null;
  } catch (error) {
    console.error('Error resolving redirect:', error);
    return null;
  }
};

const getInstagramGraphqlData = async (url) => {
  const igId = await resolveInstagramRedirect(url);
  if (!igId) return null;

  const graphql = new URL('https://www.instagram.com/api/graphql');
  graphql.searchParams.set('variables', JSON.stringify({ shortcode: igId }));
  graphql.searchParams.set('doc_id', '10015901848480474');
  graphql.searchParams.set('lsd', 'AVqbxe3J_YA');

  try {
    const response = await fetch(graphql, {
      method: 'POST',
      headers: {
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-IG-App-ID': '936619743392459',
        'X-FB-LSD': 'AVqbxe3J_YA',
        'X-ASBD-ID': '129477',
        'Sec-Fetch-Site': 'same-origin',
      },
    });

    const json = await response.json();
    const items = json?.data?.xdt_shortcode_media;
    if (!items) return null;

    return {
      videoUrl: items.video_url,
      rawResponse: JSON.stringify(items, null, 2), 
    };
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    throw new Error('Failed to fetch Instagram data');
  }
};

const handleInstagramReelCommand = async (message) => {
  const urlRegex = /(https?:\/\/(?:www\.)?instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(reels|reel|p|stories)\/[A-Za-z0-9-_]+)/;
  const match = message.content.match(urlRegex);

  if (match) {
    const url = match[0];

    try {
      const normalizedUrl = normalizeInstagramUrl(url);
      const { videoUrl } = await getInstagramGraphqlData(normalizedUrl);

      if (videoUrl) {
        const videoStream = await fetch(videoUrl);
        const videoAttachment = new AttachmentBuilder(videoStream.body, { name: 'instagram_video.mp4' });

        await message.reply({ content: 'Here is the Instagram video:', files: [videoAttachment] });
        console.log('Video uploaded to Discord successfully!');
      } else {
        message.reply('Sorry, I couldn\'t fetch the video URL.');
      }
    } catch (error) {
      console.error(error);
      message.reply('There was an error while fetching the video.');
    }
  }
};

const handleSlashCommand = async (interaction) => {
  if (!interaction.isCommand() || interaction.commandName !== 'reel') return;

  const url = interaction.options.getString('link');
  if (!url) {
    await interaction.reply({ content: 'Please provide a valid Instagram link.', ephemeral: true });
    return;
  }

  try {
    await interaction.deferReply()
    
    const normalizedUrl = normalizeInstagramUrl(url);
    const instagramData = await getInstagramGraphqlData(normalizedUrl);
    
    if (instagramData) {
      const { videoUrl, rawResponse } = instagramData;

      if (instagramData) {
        const parsedData = JSON.parse(rawResponse);
        const dataToSend = {
          __typename: parsedData?.__typename,
          shortcode: parsedData?.shortcode,
          dimensions: parsedData?.dimensions,
          display_url: parsedData?.display_url,
          has_audio: parsedData?.has_audio,
          video_view_count: parsedData?.video_view_count,
          is_video: parsedData?.is_video,
          caption: parsedData?.edge_media_to_caption?.edges[0]?.node?.text || 'No caption provided',
        };

        const embed = new EmbedBuilder()
          .setTitle('Instagram Reel Data')
          .setColor(0x1DA1F2) 
          .setDescription(
            `**Type:** ${dataToSend.__typename}\n` +
            `**Shortcode:** ${dataToSend.shortcode}\n` +
            `**Dimensions:** ${JSON.stringify(dataToSend.dimensions)}\n` +
            `**Display URL:** [Image Link](${dataToSend.display_url})\n` +
            `**Has Audio:** ${dataToSend.has_audio}\n` +
            `**Video Views:** ${dataToSend.video_view_count}\n` +
            `**Is Video:** ${dataToSend.is_video}\n` +
            `**Caption:** ${dataToSend.caption}`
          )
          .setFooter({ text: 'Fetched using Instagram GraphQL API' });

      
        await interaction.editReply({
          embeds: [embed],
        });
        console.log('Slash command executed successfully!');
      } else {
        await interaction.editReply({ content: 'Sorry, I couldn\'t fetch the video URL.', ephemeral: true });
      }
    } else {
      await interaction.editReply({ content: 'No data found for the provided Instagram link.', ephemeral: true });
    }
  } catch (error) {
    console.error('Error in slash command:', error);
     if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: 'An error occurred while processing your request.' });
    } else {
      await interaction.reply({ content: 'An unexpected error occurred.', ephemeral: true });
    }
  }
};
module.exports = {
  handleInstagramReelCommand,
  handleSlashCommand,
};
