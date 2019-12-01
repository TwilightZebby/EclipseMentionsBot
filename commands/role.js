const Sequelize = require('sequelize');
const { sequelize } = require('../bot_modules/constants.js');
const { RoleData } = require('../bot_modules/tables.js');
const Discord = require("discord.js");

module.exports = {
    name: 'role',
    description: 'The main command for managing which Roles are pingable!',
    usage: '@roleToEdit allow/deny @rolePing',
    aliases: ['r'],
    args: true,
    commandType: 'role',
    accessPerm: 2,
    async execute(message, args) {
      // To limit this command to Guild Owners only
      if(message.author.id != message.guild.ownerID) {
        return message.reply(`Sorry, but this command is limited to the Guild Owner.`);
      }

      // Creation of Embed
      const roleEmbed = new Discord.MessageEmbed().setColor('#07f5f1').setFooter('Mention Management Module');

      // Function for grabbing them role objects!
      function getRoleFromMention(mention) {
        // The id is the first and only match found by the RegEx.
        const matches = mention.match(/^<@\&!?(\d+)>$/);
      
        // If supplied variable was not a mention, matches will be null instead of an array.
        if (!matches) return;
      
        // However the first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];
      
        return message.guild.roles.get(id);
      }

      // Just to prevent SQL injection and stuff like that.....
      function checkPermission(permission) {
        
        if(permission != "deny" && permission != "allow") {
          permission = null;
          return permission;
        } else {
          return permission;
        }

      }
      
      // First, check there are three arguements!
      if(args.length != 3) {
        roleEmbed.addField(`\u200B`, `Sorry, but there wasn\'t enough arguments!`);
        return message.channel.send(roleEmbed);
      }

      // Grab the three arguements we need
      const roleToEdit = getRoleFromMention(args.shift());
      const rolePermission = checkPermission(args.shift());
      const rolePing = getRoleFromMention(args.shift());
      const guildsID = message.guild.id; // Need this for database

      // Error Checking - We don't want to store null values!
      if(roleToEdit == null || rolePing == null) {
        roleEmbed.addField(`Something went wrong...`, `Ensure you gave a ROLE mention instead of a USER or CHANNEL mention!\n
        Note: \`@everyone\` and \`@here\` Mentions are NOT supported.`);
        return message.channel.send(roleEmbed);
      }

      if(rolePermission == null) {
        roleEmbed.addField(`Something went wrong...`, `Ensure you input either \"allow\" or \"deny\" as the Permission!`);
        return message.channel.send(roleEmbed);
      }

      // Grab the Role IDs to save to Database
      const roleToEditID = roleToEdit.id;
      const rolePingID = rolePing.id;

      // Attempt to edit existing data first IF IT EXISTS
      const editRole = await RoleData.update({ userPermission: rolePermission }, { where: { guildID: guildsID, userRole: roleToEditID, pingRole: rolePingID } })
        .catch(err => console.error(`ERROR: Something happened. - role.js editRole - \n${err}`));
      if(editRole > 0) {
        roleEmbed.addField(`\u200B`, `✅ Successfully saved Role Mention settings!`);
        return message.channel.send(roleEmbed);
      }

      // Otherwise, create the Database entry!
      try {
        const roleBase = await RoleData.create({
          guildID: guildsID,
          userRole: roleToEditID,
          pingRole: rolePingID,
          userPermission: rolePermission,
        });
        roleEmbed.addField(`\u200B`, `✅ Successfully created and saved Role Mention settings!`);
        return message.channel.send(roleEmbed);
      }
      catch (e) {
        if(e.name === 'SequelizeUniqueConstraintError') {
          return message.reply(`If you get this error, which you shouldn\'t do, PLEASE CONTACT \<\@156482326887530498\>!`);
        } else if(e.name === 'SequelizeDatabaseError') {
          return message.reply(`Oops! Seems like there is something wrong with the Database! Please send a message to \<\@156482326887530498\> is this error continues.`);
        } else {
          return message.reply(`Hmmmm, something went wrong - thus, this has not been saved.`);
          //return message.channel.send(`${e}`);
        }
      }

      //END OF COMMAND
    },
};
