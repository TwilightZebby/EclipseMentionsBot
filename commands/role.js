const Sequelize = require('sequelize');
const { sequelize } = require('../bot_modules/constants.js');
const { RoleData } = require('../bot_modules/tables.js');
const Discord = require("discord.js");

module.exports = {
    name: 'role',
    description: `The main command for managing which Roles are pingable!\n*Note: use on its own to trigger the process!*`,
    usage: ' ',
    aliases: ['r', 'mentions', 'm'],
    //args: true,
    commandType: 'role',
    accessPerm: 2,
    async execute(message) {
      const roleEmbed = new Discord.MessageEmbed().setColor('#07f5f1').setFooter('Mention Management Module');

      // Grab the Roles in the Guild
      var roleStoreArray = message.guild.roles.array();
      roleStoreArray.sort((a, b) => { return b.rawPosition - a.rawPosition });
      
      // For help in Embed creation
      var data = [];
      var dataTwo = [];

      for(let i = 0; i < (roleStoreArray.length - 1); i++) {
        let roleStringOne = i + ": \<\@\&" + roleStoreArray[i].id + "\>";
        data.push(roleStringOne);
      }
      
      for(let j = 0; j < (roleStoreArray.length - 1); j++) {
        let roleStringOneTwo = j + ": \<\@\&" + roleStoreArray[j].id + "\>";
        dataTwo.push(roleStringOneTwo);
      }


      roleEmbed.addField(`List of Roles in ${message.guild.name}:`, data.join(' \n '));
      roleEmbed.addField(`Step One:`, `Please choose, using one of the numbers listed, the Role you would like to manage`);
      message.channel.send(roleEmbed);
      roleEmbed.spliceField(0, 2);

      // RegEx for numerical inputs
      const numRegex = new RegExp(`[0-9]`);
      const filter = m => m.content.match(numRegex);
      // RegEx for worded inputs
      const permRegex = new RegExp("(allow|deny)", "g");
      const permFilter = m => m.content.match(permRegex);
      // For fetching that User Choice!
      var userRoleChoice = null;
      var permChoice = null;
      var pingRoleChoice = null;
      var confirmChoice = null;

      const collectorOne = message.channel.createMessageCollector(filter, { idle: 10000 })
       .on('collect', m => collectorOne.stop())
       .on('end', (collected, reason) => WhenCollectorOneEnds(collected, reason));


       // *******************************
       // FOR COLLECTOR ONE
       // *******************************

       async function WhenCollectorOneEnds(collected, reason) {

        if(reason == 'time' || reason == 'idle') {
          roleEmbed.addField(`⌛ Timeout!`, `Sorry, need to be quicker! 😜`);
          return message.channel.send(roleEmbed);
        }

        const collect = collected.array();
        userChoice = parseInt(collect[0].content);

        if(userChoice == null) {
          roleEmbed.addField(`Oops!`, `Something broke. Don't worry, just try the command again!`);
          return message.channel.send(roleEmbed);
        } else if(userChoice > (roleStoreArray.length - 1)) {
          roleEmbed.addField(`Whoops!`, `That number wasn't accepted. Please try using the command again.`);
          return message.channel.send(roleEmbed);
        }

        userRoleChoice = roleStoreArray[userChoice];
        roleEmbed.addField(`\u200B`, `Managing ${userRoleChoice} Role`);
        roleEmbed.addField(`List of Roles in ${message.guild.name}:`, dataTwo.join(' \n '));
        roleEmbed.addField(`Step Two:`, `Please select, using a number listed, which Role you would like prevent/allow ${userRoleChoice} from mentioning`);
        message.channel.send(roleEmbed);
        roleEmbed.spliceField(0, 3);

        const collectorTwo = message.channel.createMessageCollector(filter, { idle: 10000 })
         .on('collect', m => collectorTwo.stop())
         .on('end', (collected, reason) => WhenCollectorTwoEnds(collected, reason));

      }

      // *******************************
      // FOR COLLECTOR TWO
      // *******************************

      async function WhenCollectorTwoEnds(collected, reason) {
        
        if(reason == 'time' || reason == 'idle') {
          roleEmbed.addField(`⌛ Timeout!`, `Sorry, need to be quicker! 😜`);
          return message.channel.send(roleEmbed);
        }

        const collect = collected.array();
        userChoice = parseInt(collect[0].content);

        if(userChoice == null) {
          roleEmbed.addField(`Oops!`, `Something broke. Don't worry, just try the command again!`);
          return message.channel.send(roleEmbed);
        } else if(userChoice > (roleStoreArray.length - 1)) {
          roleEmbed.addField(`Whoops!`, `That number wasn't accepted. Please try the command again.`);
          return message.channel.send(roleEmbed);
        }

        pingRoleChoice = roleStoreArray[userChoice];

        roleEmbed.addField(`Step Three:`, `Should ${userRoleChoice} be able to \`@mention\` ${pingRoleChoice}?`);
        roleEmbed.addField(`\u200B`, `Please enter either **allow** or **deny**`);
        message.channel.send(roleEmbed);
        roleEmbed.spliceField(0, 2);

        const collectorThree = message.channel.createMessageCollector(permFilter, { idle: 10000 })
         .on('collect', m => collectorThree.stop())
         .on('end', (collected, reason) => WhenCollectorThreeEnds(collected, reason));

      }

      // *******************************
      // FOR COLLECTOR THREE
      // *******************************

      async function WhenCollectorThreeEnds(collected, reason) {
        
        if(reason == 'time' || reason == 'idle') {
          roleEmbed.addField(`⌛ Timeout!`, `Sorry, need to be quicker! 😜`);
          return message.channel.send(roleEmbed);
        }

        const collect = collected.array();
        permChoice = collect[0].content.toString().toLowerCase();

        if(permChoice == null) {
          roleEmbed.addField(`Oops!`, `Something broke. Don't worry, just try the command again!`);
          return message.channel.send(roleEmbed);
        } else if(permChoice != "allow" && permChoice != "deny") {
          roleEmbed.addField(`Whoops!`, `That wasn't accepted. Please try the command again.`);
          return message.channel.send(roleEmbed);
        }

        var tempPermString;
        if(permChoice == "allow") {
          tempPermString = "allowed";
        } else if(permChoice == "deny") {
          tempPermString = "denied";
        }

        roleEmbed.addField(`\u200B`, `${userRoleChoice} will be ${tempPermString} mentioning ${pingRoleChoice}`);
        roleEmbed.addField(`Confirmation:`, `Please confirm this choice by sending **yes**`);
        message.channel.send(roleEmbed);
        roleEmbed.spliceField(0, 2);

        const confirmRegEx = new RegExp("yes", "g");
        const confirmFilter = m => m.content.match(confirmRegEx);

        const collectorFour = message.channel.createMessageCollector(confirmFilter, { idle: 10000 })
         .on('collect', m => collectorFour.stop())
         .on('end', (collected, reason) => WhenCollectorFourEnds(collected, reason));

      }

      // *******************************
      // FOR COLLECTOR FOUR
      // *******************************

      async function WhenCollectorFourEnds(collected, reason) {

        if(reason == 'time' || reason == 'idle') {
          roleEmbed.addField(`⌛ Timeout!`, `Sorry, need to be quicker! 😜`);
          return message.channel.send(roleEmbed);
        }

        const collect = collected.array();
        confirmChoice = collect[0].content.toString().toLowerCase();

        if(confirmChoice == null) {
          roleEmbed.addField(`Oops!`, `Something broke. Don't worry, just try the command again!`);
          return message.channel.send(roleEmbed);
        } else if(confirmChoice != "yes") {
          roleEmbed.addField(`Oh, ok.`, `Seems like you didn\'t actually want this. Ok then!`);
          return message.channel.send(roleEmbed);
        }

        // DO THE THING
        // (Add/Edit the Mention settings to/in the Database)

        const userRID = userRoleChoice.id;
        const pingRID = pingRoleChoice.id;
        const guildsID = message.guild.id;

        // Attempt to edit existing data first IF IT EXISTS
        const editRole = await RoleData.update({ userPermission: permChoice }, { where: { guildID: guildsID, userRole: userRID, pingRole: pingRID } })
          .catch(err => console.error(`ERROR: Something happened. - role.js editRole - \n${err}`));
        if(editRole > 0) {
          roleEmbed.addField(`\u200B`, `✅ Successfully saved Role Mention settings!`);
          return message.channel.send(roleEmbed);
        }

        // Otherwise, create the Database entry!
        try {
          const roleBase = await RoleData.create({
          guildID: guildsID,
          userRole: userRID,
          pingRole: pingRID,
          userPermission: permChoice,
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

      }

      //END OF COMMAND
    },
};
