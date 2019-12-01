const Discord = require("discord.js");

module.exports = {
    name: 'prefix',
    description: 'Shows the current Prefix',
    usage: ' ',
    //aliases: [''],
    //args: true,
    commandType: 'general',
    acessPerm: 4,
    execute(message) {
      const prefixEmbed = new Discord.MessageEmbed().setColor('#07f51b').setFooter('Prefix Module');
      prefixEmbed.addField(`Current Prefix:`, `m%\nor\<\@627918420859420693\> can be used`);

      message.channel.send(prefixEmbed);

      //END OF COMMAND
    },
};
