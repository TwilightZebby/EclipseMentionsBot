const { PREFIX } = require('../config.js');
const Discord = require("discord.js");

module.exports = {
    name: 'example',
    description: 'Outputs an example usage of the r%role command',
    usage: ' ',
    //aliases: [''],
    //args: true,
    commandType: 'role',
    accessPerm: 2,
    execute(message, args) {
      // To limit this command to Guild Owners only
      if(message.author.id != message.guild.ownerID) {
        return message.reply(`Sorry, but this command is limited to the Guild Owner.`);
      }

      const exampleEmbed = new Discord.MessageEmbed().setColor('#07f51b').setFooter('Example Module');

      var exampleArray = ['role @Member deny @Owner', 'role @Staff allow @Owner', 'role @Members deny @AnimeNight', 'role @Staff deny @Members'];
      var arrayChoice = Math.floor( (Math.random() * exampleArray.length) + 0);
      var exampleString = PREFIX + exampleArray[arrayChoice];

      exampleEmbed.addField(`Example Command Usage`, `${exampleString}`);

      return message.channel.send(exampleEmbed);

      //END OF COMMAND
    },
};
