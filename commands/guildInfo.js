const { PREFIX } = require('../config.js');
const Discord = require("discord.js");

module.exports = {
    name: 'guildinfo',
    description: 'Shows information about the Guild/Server.',
    usage: ' ',
    guildOnly: true,
    aliases: ['serverinfo', 'gi', 'si', 'g', 's'],
    commandType: 'hidden',
    accessPerm: 4,
    execute(message, args) {
      const guildEmbed = new Discord.MessageEmbed().setColor('#9e139e').setFooter('Guild Information Module');

      const thisGuild = message.guild;
      // GENERAL GUILD INFO
      const guildName = thisGuild.name;
      const guildIconURL = thisGuild.iconURL();
      const guildRegion = thisGuild.region;
      const guildOwner = thisGuild.owner;
      const guildCreationDate = thisGuild.createdAt.toDateString();
      const guildBoostTier = thisGuild.premiumTier;
      const guildChannelAmount = thisGuild.channels.array().length;
      const guildMemberAmount = thisGuild.memberCount;

      var guildEmojis = thisGuild.emojis.array();
      var guildEmojiAmount = null;
      if(guildEmojis === undefined) { guildEmojis = null; } else { guildEmojiAmount = guildEmojis.length; }

      var guildRoleAmount = thisGuild.roles.array().length;
      if(guildRoleAmount === undefined) { guildRoleAmount = null; }


      // EMBED TIME!
      guildEmbed.setTitle(guildName);
      guildEmbed.setDescription(`Guild Owner: ${guildOwner}`);
      guildEmbed.setThumbnail(guildIconURL);
      guildEmbed.addField(`Server Region`, `${guildRegion}`, true);
      guildEmbed.addField(`Date Created`, `${guildCreationDate}`, true);
      guildEmbed.addField(`Boost Tier (Level)`, `${guildBoostTier}`, true);
      guildEmbed.addField(`Channel Amount`, `${guildChannelAmount}`, true);
      guildEmbed.addField(`Member Amount (inc. Bots)`, `${guildMemberAmount}`, true);

      if(guildEmojis != undefined) { guildEmbed.addField(`Emoji Amount`, `${guildEmojiAmount}`, true); }
      if(guildRoleAmount != undefined) { guildEmbed.addField(`Role Amount`, `${guildRoleAmount}`, true); }

      return message.channel.send(guildEmbed);


      // END OF COMMAND
    },
};
