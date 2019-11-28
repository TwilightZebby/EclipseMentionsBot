// Creating the veraibles needed
const fs = require('fs'); // Node's native file system
const Discord = require("discord.js"); // Bringing in Discord.js
const Sequelize = require('sequelize'); // Brings in Sequelize - used for Database stuff
const { client, sequelize } = require('./bot_modules/constants.js'); // Brings in the Discord Bot's Client and Sequelize Database
const { RoleData } = require('./bot_modules/tables.js'); // Brings in the Database Tables!
const { PREFIX, TOKEN } = require('./config.js'); // Slapping the PREFIX and token into their own vars
client.commands = new Discord.Collection(); // Extends JS's native map class
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Picks up all the .js files in the commands folder
const cooldowns = new Discord.Collection(); // For Cooldowns to work

for (const file of commandFiles) { // Slaps all the command files into the Collection
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

// To make sure the bot is up and running
client.on("ready", () => {
  RoleData.sync();
  console.log("I am ready!");
  client.user.setActivity(`${PREFIX}help`); // Sets a Playing Status on the Bot
});

// Catch those warnings
client.on("warn", (warning) => {
  console.log("Warning: ", warning);
});

// Catch when the RateLimit is hit!
client.on("rateLimit", (rlMsg) => {
  console.log("RateLimit was hit: ", rtMsg);
});

/***********************************************/
/*THE COMMANDS*/
/*Runs whenever a message is sent in a command the Bot has access to*/

client.on("message", async (message) => {

  // If the msg does NOT start with the PREFIX, OR it was sent by the bot itself - STOP
  if (!message.content.startsWith(PREFIX) || message.author.bot) {
		if(message.author.bot) {
      return;
    }

    // Override for Guild Owners
    if(message.author.id === message.guild.ownerID) {
      return;
    }

    // The functions
    /*********************
    * To check if there are any mentions!
    *********************/
    function CheckForMentions(message) {
      if(Array.from(message.mentions.roles).length < 1) {
        return false;
      } else {
        return true;
      }
    }

    /*********************
    * To grab the first mention in a message
    *********************/
    function GrabMention(mention) {
      // The id is the first and only match found by the RegEx.
      const matches = mention.match(/^<@\&!?(\d+)>$/);

      // If supplied variable was not a mention, matches will be null instead of an array.
      if (!matches) return;

      // However the first element in the matches array will be the entire mention, not just the ID,
      // so use index 1.
      const id = matches[1];

      return message.guild.roles.get(id);
    }

    /*********************
    * Checking the mention & Author role against the Database
    *********************/

    async function CheckAgainstDatabase(pingedMention, authorRole, guildsID) {
      const roleCheck = await RoleData.findOne({ where: { guildID: guildsID, userRole: authorRole, pingRole: pingedMention } })
        .catch(err => console.error(`ERROR: Something happened. - index.js roleCheck - \n${err}`));
      if(roleCheck) {
        return roleCheck.dataValues.userPermission;
      } else {
        return false;
      }
    }

    /*********************
    * To grab the highest Role (of the Author) saved to the Database
    *********************/

    async function GrabHighestSavedRole(message, guildsID) {
      const highestSavedRole = message.member.roles.highest.id;
      const authorRoleCheck = await RoleData.findAll({ where: { guildID: guildsID, userRole: highestSavedRole } })
        .catch(err => console.error(`ERROR: Something happened. - index.js authorRoleCheck - \n${err}`));
      if(authorRoleCheck.length > 0) {
        return highestSavedRole;
      } else {
        // If the actual Highest Role isn't saved in the Database
        var storeRoles = Array.from(message.member.roles.values());
        // Remove the @everyone Role
        const lowestBin = storeRoles.pop();

        var storeHighestRole = null;

        for(let i = 0; i < storeRoles.length; i++) {
          let roleID = storeRoles[i].id;

          let newRoleCheck = await RoleData.findAll({ where: { guildID: guildsID, userRole: roleID } })
            .catch(err => console.error(`ERROR: Something happened. - index.js newRoleCheck - \n${err}`));

          if(newRoleCheck.length > 0) {
            i += 999;
            storeHighestRole = roleID;
          } else {
            storeHighestRole = false;
          }

        }
        return storeHighestRole;

      }
    }

    // Now for the checking

    var mentionCheck = CheckForMentions(message);
    var mentionGrab;
    if(mentionCheck == true) {
      mentionGrab = GrabMention(message.toString());
      if(mentionGrab == null) {
        return;
      }

      // Grab the IDs needed
      var pingedID = mentionGrab.id;
      var guildsID = message.guild.id;
      var authorID = await GrabHighestSavedRole(message, guildsID);
      if(authorID == false) {
        return;
      }

      var uPermis = await CheckAgainstDatabase(pingedID, authorID, guildsID);
      if(uPermis == false) {
        return;

      } else if(uPermis == 'deny') {
        await message.delete();
        return message.reply(`Sorry, but you don\'t have the permissions to \`@ping\` that Role!`);

      } else if(uPermis == 'allow') {
        return;
      } else {
        return;
      }

    } else if(mentionCheck == false) {
      return;
    }
  };
  
  // *************************
  // FOR COMMANDS
  // *************************

  // Slides the PREFIX off the command
  const args = message.content.slice(PREFIX.length).split(/ +/);
  // Slaps the cmd into its own var
  const commandName = args.shift().toLowerCase();
  // If there is NOT a command with the given name or aliases, exit early
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;

  // COOLDOWNS
  // If a command has 'cooldown: x,' it will enable cooldown IN SECONDS
  if (!cooldowns.has(command.name)) {
     cooldowns.set(command.name, new Discord.Collection());
   }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
   } else {
     timestamps.set(message.author.id, now);
     setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
   }

  // A check for if the user ran a command inside DMs
  // if a cmd has 'guildOnly: true,', it won't work in DMs
  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  // A check for if the user ran a command inside Guilds
  // if a cmd has 'dmOnly: true,', it won't work in Guilds
  if (command.dmOnly && message.channel.type !== 'dm') {
    return message.reply('I can\'t execute that command inside Guilds!')
  }

  // A check for missing parameters
  // If a cmd has 'args: true,', it will throw the error
  // Requires the cmd file to have 'usage: '<user> <role>',' or similar
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
      if (command.usage) {
        reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
      }
      return message.channel.send(reply);
  }

  // Check Command's Guild Access
  if (command.accessPerm == 1) {
    // DEV ONLY
    if(message.author.id != '156482326887530498') {
      return message.reply(`Sorry, but this command is limited to the Bot Developer!`);
    }
  } else if(command.accessPerm == 2) {
    // Guild Owners ONLY
    if(message.author.id != message.guild.ownerID) {
      return message.reply(`Sorry, but this command is limited to the Guild Owner.`);
    }
  } else if(command.accessPerm == 3) {
    // Saved Guild Admins ONLY
    // PLACEHOLDER
  }
  // accessPerm of 4 means EVERYONE can use it.

  // If there is, grab and run that command's execute() function
  try {
    command.execute(message, args);
  } // Any errors are caught here, and thrown back at the User and Console
  catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
  // Extra Error Catching
  process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

  /******************************************************/
  
});

/***********************************************/
// The token to connect the bot to the Bot Account on Discord
client.login(TOKEN);
