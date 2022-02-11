const clientLoader = require('./src/clientLoader');
const commandLoader = require('./src/commandLoader');
const banWordsFeature = require('./features/banWords');
const exFeature = require('./features/xp');
const sharedFeature = require('./features/shared');
require('colors');
require('dotenv');

const COMMAND_PREFIX = process.env.COMMAND_PREFIX;

clientLoader.createClient([
  'GUILDS',
  'GUILD_MEMBERS',
  'GUILD_MESSAGES'
])
  .then(async (client) => {
    await commandLoader.load(client);

    client.on('guildMemberAdd', member => {
      try {
        member.roles.add(process.env.STARTING_ROLE)
      } catch (error) {
        console.error(`[ERROR] [guildMemberAdd] => ${error}`);
      }
    })

    client.on('messageCreate', async (message) => {
      // Ne pas tenir compte des messages envoyés par les bots
      if (message.author.bot) return;

      // Run features
      try {
        if (await banWordsFeature(message)) return; // Return if banWord
        exFeature(message);
        sharedFeature(client, message);
      } catch (error) {
        console.error(`[ERROR] [Features] => ${error}`);
      }

      // Ne pas tenir compte des messages qui ne commencent pas par le préfix
      if (!message.content.startsWith(COMMAND_PREFIX)) return;

      // On découpe le message pour récupérer tous les mots
      const words = message.content.split(' ');

      const commandName = words[0].slice(COMMAND_PREFIX.length); // Le premier mot du message, auquel on retire le préfix
      const arguments = words.slice(1); // Tous les mots suivants sauf le premier

      if (client.commands.has(commandName)) {
        // La commande existe, on la lance
        try {
          client.commands.get(commandName).run(client, message, arguments);
        } catch (error) {
          console.error(`[ERROR] [Command] [${commandName}] => ${error}`);
        }
      } else {
        // La commande n'existe pas, on prévient l'utilisateur
        await message.delete();
        await message.channel.send(`The ${commandName} does not exist.`);
      }
    })
  });
