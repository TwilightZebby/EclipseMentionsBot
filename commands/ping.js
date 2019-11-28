const Discord = require("discord.js");

module.exports = {
    name: 'ping',
    description: 'Pong, divide by 2?',
    usage: ' ',
    commandType: 'general',
    acessPerm: 4,
    execute(message) {
      //>>>>>>>>>> Return Heartbeat Ping <<<<<<<<<<
      const pingEmbed = new Discord.MessageEmbed().setColor('#07f51b').setFooter('Ping Module');

      var authorName;
      if(message.member.nickname == null) {
        authorName = message.author.username;
      } else {
        authorName = message.member.nickname;
      }

      pingEmbed.addField(`${authorName}\'s Ping to the Bot is:`,`${message.client.ws.ping.toFixed(2)} milliseconds`);

      return message.channel.send(pingEmbed);
    },
};
