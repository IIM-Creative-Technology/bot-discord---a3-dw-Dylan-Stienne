db = require('../database')
banWords = require('./banWords.json')
require('dotenv').config()

module.exports = (message) => {
    const member = message.member
    const guild = message.guild

    // Watch if message contains banwords
    banWords.forEach(banWord => {
        if (message.content.toLowerCase().includes(banWord)) {
            message.delete();
            member.send(`Hi ${message.author.username}, please use corrects words only, '${banWord}' is not allowed !`);

            // Store +1 warning in database
            db.query(`SELECT * FROM warnings WHERE user_id=${member.id} AND guild_id=${guild.id}`).then(res => {
                // If user not have any warning for this guild
                if (res.length == 0) {
                    db.query(`INSERT INTO warnings (user_id, guild_id) VALUES (${member.id}, ${guild.id})`)

                } else { // Else add 1 warning
                    db.query(`UPDATE warnings SET count = count + 1 WHERE user_id=${member.id} AND guild_id=${guild.id}`)

                    // Ban member if he go over the warnings limit 
                    if (res[0].count >= process.env.WARNINGS_COUNT_BEFORE_BAN && member.bannable) {
                        member.ban()
                        db.query(`UPDATE warnings SET count = 0 WHERE user_id=${member.id} AND guild_id=${guild.id}`)
                    }
                }
            })

            // Return true if word was a banWord
            return true
        }
    });

    // Return false if the word is ok
    return false
}