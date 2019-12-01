const Sequelize = require('sequelize');
const { sequelize } = require('../bot_modules/constants.js');
const { RoleData } = require('../bot_modules/tables.js');
const Discord = require("discord.js");

module.exports = {
    name: 'delete',
    description: `Used for deleting a single entry in your Server\'s Database\n*Note: Use on its own to trigger the process. No options are accepted on initial use!*`,
    usage: ' ',
    aliases: ['del'],
    //args: true,
    commandType: 'role',
    acessPerm: 2,
    async execute(message) {
      const delEmbed = new Discord.MessageEmbed().setColor('#07f5f1').setFooter('Mention Management Module');

      var roleStoreArray = message.guild.roles.array();
      var everyoneBin = roleStoreArray.shift();
      var data = [];
      var tempNumber = 0;

      // Search for and grab all the Roles stored within the Database
      for(let r = 0; r < roleStoreArray.length; r++) {
        let roleSearch = await RoleData.findAll({ where: { guildID: message.guild.id, userRole: roleStoreArray[r].id } })
          .catch(err => console.error(`ERROR: Something happened. - delete.js roleSearch - \n${err}`));

        if(roleSearch.length > 0) {
          // Turn those Role IDs into Role Mentions!
          let tempNum = tempNumber + 1;
          tempNumber++;
          let roleString = tempNum + ': <@&' + roleSearch[0].userRole + '>';
          data.push(roleString);
        }

      }

      // Check how many Roles were found
      if(data.length < 1) {
        delEmbed.addField(`Error:`, `Nothing is saved to the Database for this Server.\nThus, this command cannot be used!`);
        return message.channel.send(delEmbed);
      }

      // ********************************
      // FIRST PART:
      //   Dump all the found userRoles in the Embed, and ask for the Guild Owner to pick one to manage
      // ********************************

      delEmbed.addField(`List of Roles currently saved to Database:`, data.join(' \n '))
      delEmbed.addField(`Step One:`, `Please select one of these Roles (by using the corresponding number) to manage`);
      message.channel.send(delEmbed);
      delEmbed.spliceField(0, 2);

      const numRegex = new RegExp(`[0-9]`);
      const filter = m => m.content.match(numRegex);
      var pOneDone = false; // To help move onto PART TWO
      var userChoice = null; // For fetching that User Choice!

      const collectorOne = await message.channel.createMessageCollector(filter, { time: 10000, idle: 10000 })
       .on('collect', m => collectorOne.stop())
       .on('end', (collected, reason) => {

        if(reason == 'time' || reason == 'idle') {
          delEmbed.addField(`⌛ Timeout!`, `Sorry, need to be quicker! 😜`);
          return message.channel.send(delEmbed);
        }
        
        pOneDone = true;
        const collect = collected.array();
        userChoice = parseInt(collect[0].content);
      });

      // Should we go to PART TWO?
      if(pOneDone == false) {
        return;
      }

      if(userChoice == null) {
        delEmbed.addField(`Oops!`, `Something broke. Don't worry, just try again!`);
        return message.channel.send(delEmbed);
      } else if(userChoice > roleStoreArray.length) {
        delEmbed.addField(`Whoops!`, `That number wasn't accepted. Please try again.`);
        return message.channel.send(delEmbed);
      }


      // ********************************
      // SECOND PART:
      //   Use the selected userRole and bring up a list of all the pingRoles attached.
      //   Then, allow the User to choose which entry to delete.
      // ********************************

      const selectedUserRole = await RoleData.findAll({ where: { guildID: message.guild.id, userRole: roleStoreArray[userChoice - 1].id }, order: ['pingRole', 'ASC'] })
      .catch(err => console.error(`ERROR: Something happened. - delete.js selectedUserRole - \n${err}`));

      if(selectedUserRole.length < 1) {
        delEmbed.addField(`🦆 Quack!`, `Hmmm, this shouldn't be an error!\nIf you get it, ping a message to \<\@156482326887530498\>`);
        return message.channel.send(delEmbed);
      }

      var dataTwo = [];
      var anotherTempNumber = 0;
      for(let s = 0; s < selectedUserRole.length; s++) {

        let tempNumb = anotherTempNumber + 1;
        anotherTempNumber++;

        let uPermSymbol = null;
        let uPerm = null;
        if(selectedUserRole[s].userPermission == 'deny') {
          uPermSymbol = "❌";
          uPerm = "**cannot** mention";
        } else if(selectedUserRole[s].userPermission == 'allow') {
          uPermSymbol = "✅";
          uPerm = "**can** mention";
        }

        let dataString = tempNumb + ': ' + uPermSymbol + ' \<\@\&' + selectedUserRole[s].userRole + '> ' + uPerm + ' \<\@\&' + selectedUserRole[s].pingRole + '\>';
        dataTwo.push(dataString);

      }

      delEmbed.addField(`\u200B`, dataTwo.join(' \n '));
      delEmbed.addField(`Part Two:`, `Please select which entry you would like to delete by using the numbers listed`);
      message.channel.send(delEmbed);


      //END OF COMMAND
    },
};
