const Discord = require('discord.js');
db = require('../database');
helpers = require('../helpers');

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
  db.query(`SELECT xp_level FROM xp WHERE user_id=${message.member.id} AND guild_id=${message.guild.id}`).then(lvl => {
    let level = 0
    if (lvl.length > 0) {
      level = lvl[0]['xp_level']
    }
    const color = helpers.levelColor(level)

    // Send result
    const embed = new Discord.MessageEmbed();
    embed.setTitle(message.author.username)
    embed.setDescription(`Your account is level ${level}`)
    embed.setColor(color)
    message.channel.send({ embeds: [embed] })
  })
};

module.exports.name = 'level';
