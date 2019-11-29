const Sequelize = require('sequelize');
const { sequelize } = require('../bot_modules/constants.js');
const { RoleData } = require('../bot_modules/tables.js');
const Discord = require("discord.js");

module.exports = {
    name: 'list',
    description: 'List all the Role Mention settings saved for this Guild/Server!',
    usage: ' ',
    //aliases: [''],
    //args: true,
    commandType: 'role',
    accessPerm: 2,
    async execute(message) {
      // To limit this command to Guild Owners only
      if(message.author.id != message.guild.ownerID) {
        return message.reply(`Sorry, but this command is limited to the Guild Owner.`);
      }

      // Creation of Embed
      const listEmbed = new Discord.MessageEmbed().setColor('#a906d1').setFooter('Mention Management Module');

      // Grab all the stored data for the Guild requested
      const roleList = await RoleData.findAll({ where: { guildID: message.guild.id }, order: [ ['userRole', 'ASC'] ] });

      // In case there is NOTHING
      if(roleList < 1) {
        listEmbed.addField(`\u200B`, `There is nothing in the Database for this Guild.`);
        return message.channel.send(listEmbed);
      }

      // Grab the amount of Roles in the Guild, and use that as part of
      // the loop to output the Roles saved to the Database
      // (Each userRole should be its own Embed)
      var roleStoreArray = message.guild.roles.array();
      var everyoneBin = roleStoreArray.shift();

      for(let r = 0; r < roleStoreArray.length; r++) {
        let data = [];
        let roleSearch = await RoleData.findAll({ where: { guildID: message.guild.id, userRole: roleStoreArray[r].id }, order: [ ['pingRole', 'DESC'] ] });
        if(roleSearch.length > 0) {
          let embedString = "";

          for(let s = 0; s < roleSearch.length; s++) {
            var uPerm;
            if(roleSearch[s].userPermission == 'deny') {
              uPerm = "❌ Cannot ";
            } else if(roleSearch[s].userPermission == 'allow') {
              uPerm = "✅ Allowed to ";
            }

            let pingedRole = message.guild.roles.get(roleSearch[s].pingRole);

            embedString = uPerm + `mention \<\@\&` + pingedRole + `\>`;
            data.push(embedString);
          }

          let uRole = message.guild.roles.get(roleSearch[0].userRole);
          listEmbed.addField(`${uRole.name}`, `${data.join(` \n `)}`);
        }
      }

      return message.channel.send(listEmbed);

      //END OF COMMAND
    },
};
