const Discord = require('discord.js');
db = require('../database')
helpers = require('../helpers')

module.exports = (client, message) => {
    // If message is not send on a 'shared' channel, return
    if (message.channel.name != 'shared') { return }

    // Get user level
    db.query(`SELECT xp_level FROM xp WHERE user_id=${message.member.id} AND guild_id=${message.guild.id}`).then(lvl => {
        let level = 0
        if (lvl.length > 0) {
            level = lvl[0]['xp_level']
        }
        const color = helpers.levelColor(level)

        // Get all servers where the bot is
        client.guilds.fetch().then(guilds => {
            guilds.forEach(guild => {
                guild.fetch().then(guild => {
                    guild.channels.fetch().then(channels => {
                        channels.forEach(channel => {
                            // If channel name is 'shared', send message
                            if (channel.name == 'shared' && channel.id != message.channel.id) {
                                const embed = new Discord.MessageEmbed();
                                embed.setTitle(message.author.username)
                                embed.setDescription(message.content)
                                embed.addField('From server', message.guild.name)
                                embed.addField('Server level', `${level}`)
                                embed.setColor(color)
                                channel.send({ embeds: [embed] })
                            }
                        })
                    })
                })
            });
        })
    })
}