const { PREFIX } = require('../config.js');

module.exports = {
    name: 'example',
    description: 'Outputs an example usage of the r%role command',
    usage: ' ',
    //aliases: [''],
    //args: true,
    commandType: 'role',
    execute(message, args) {
      var exampleArray = ['role @Member deny @Owner', 'role @Staff allow @Owner', 'role @Members deny @AnimeNight', 'role @Staff deny @Members'];
      var arrayChoice = Math.floor( (Math.random() * exampleArray.length) + 0);

      return message.channel.send(`${PREFIX}` + exampleArray[arrayChoice]);

      //END OF COMMAND
    },
};
