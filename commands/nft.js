const Discord = require('discord.js');
const api = require('axios');

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
  res = await api.get(`https://api.x.immutable.com/v1/collections/${arguments[0]}`)

  const embed = new Discord.MessageEmbed();
  embed.setTitle(res.data.name)
  embed.setDescription(res.data.description)
  embed.setThumbnail(res.data.icon_url)

  message.channel.send({ embeds: [embed] })
};

module.exports.name = 'nft';
