db = require('../database')
helpers = require('../helpers')
require('dotenv').config()

assignGuildRole = async (guild, member, level) => {
    // Assign th level role
    guild.roles.fetch().then((roles) => {
        roleFound = null
        levelsRoles = []

        roles.forEach(role => {
            if (role.name == `${process.env.ROLE_LEVEL_PREFIX}${level}` && role.color == helpers.levelColor(level)) {
                roleFound = role
            }
            if (role.name.startsWith(process.env.ROLE_LEVEL_PREFIX)) {
                levelsRoles.push(role)
            }
        });

        // Remove all levels roles from user
        levelsRoles.forEach(role => {
            member.roles.remove(role).catch((err) => { })
        });

        // Create role if not exist on the guild
        if (roleFound) {
            member.roles.add(roleFound).catch((err) => { })
        } else {
            guild.roles.create({
                name: `${process.env.ROLE_LEVEL_PREFIX}${level}`,
                color: helpers.levelColor(level),
            }).then((newRole) => {
                member.roles.add(newRole)
            })
        }
    })
}

module.exports = (message) => {
    const member = message.member
    const guild = message.guild

    // Get user xp in the database
    db.query(`SELECT * FROM xp WHERE user_id=${member.id} AND guild_id=${guild.id}`).then(res => {
        // If user not exist, insert it with 1 point
        if (res.length == 0) {
            db.query(`INSERT INTO xp (user_id, guild_id) VALUES (${member.id}, ${guild.id})`)

        } else { // Else add 1 xp
            db.query(`UPDATE xp SET xp_count = xp_count + 1 WHERE user_id=${member.id} AND guild_id=${guild.id}`)

            // Change xp level
            if (res[0].xp_count >= res[0].xp_level + 3) {
                db.query(`UPDATE xp SET xp_level = xp_level + 1, xp_count = 0 WHERE user_id=${member.id} AND guild_id=${guild.id}`)
                assignGuildRole(guild, member, res[0].xp_level + 1)
            }
        }
    })
}