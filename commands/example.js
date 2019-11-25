const { PREFIX } = require('../config.js');

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

      var exampleArray = ['role @Member deny @Owner', 'role @Staff allow @Owner', 'role @Members deny @AnimeNight', 'role @Staff deny @Members'];
      var arrayChoice = Math.floor( (Math.random() * exampleArray.length) + 0);

      return message.channel.send(`${PREFIX}` + exampleArray[arrayChoice]);

      //END OF COMMAND
    },
};
