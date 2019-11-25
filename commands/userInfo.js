const { PREFIX } = require('../config.js');
const Discord = require("discord.js");

module.exports = {
    name: 'userinfo',
    description: 'Shows information about a mentioned User.',
    usage: '@user',
    args: true,
    aliases: ['user', 'ui', 'u'],
    commandType: 'hidden',
    accessPerm: 4,
    execute(message, args) {
      const userEmbed = new Discord.MessageEmbed().setColor('#9e139e').setFooter('User Information Module');

      /***************
       * To grab the User Mention
       ***************/
      function getUserFromMention(mention) {
        const matches = mention.match(/^<@!?(\d+)>$/);
        // The id is the first and only match found by the RegEx.
        // However the first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];

        return message.client.users.get(id);
      }

      if(!args.length) {
        userEmbed.addField(`Error: Missing Argument`, `You need to include a User Mention/Ping. \nExample: \`${PREFIX}userinfo @user\``);

        return message.channel.send(userEmbed);
      } else {
        const chosenUser = getUserFromMention(args[0]);
        const cUserAvatar = chosenUser.displayAvatarURL();
        const cUserName = chosenUser.username;
        const cUserBot = chosenUser.bot;
        const cUserPresence = chosenUser.presence.status;
        const cUserCreationDate = chosenUser.createdAt.toDateString();
        //const cUserlastMessage = chosenUser.lastMessage;
        const cUserMember = message.guild.member(chosenUser);
        // IF THERE IS A LAST MESSAGE
        // Start with placeholders
        var cUserRoles = null;
        var cUserJoinedGuild = null;
        var cUserGuildName = null;
        // Thing for assigning above values
        if(cUserMember) {
          cUserRoles = cUserMember.roles.array();
          cUserJoinedGuild = cUserMember.joinedAt.toDateString();
          guildName = message.guild.name;
        }
        // For checking if Guild Owner or not
        const guildOwner = message.guild.ownerID;
        var cUserIsOwner = false;
        if(guildOwner === chosenUser.id) {
          cUserIsOwner = true;
        }

        // EMBED TIME
        userEmbed.setAuthor(cUserName, cUserAvatar);
        userEmbed.setThumbnail(cUserAvatar);
        userEmbed.setDescription(`${chosenUser}`);
        userEmbed.addField(`Is a Bot?`, `${cUserBot}`, true);
        userEmbed.addField(`Status`, `${cUserPresence}`, true);
        userEmbed.addField(`Date ${cUserName} created account`, `${cUserCreationDate}`);
        if(cUserJoinedGuild != null) { userEmbed.addField(`Date ${cUserName} joined ${guildName}`, `${cUserJoinedGuild}`); }
        if(cUserRoles != null) { userEmbed.addField(`Roles ${cUserName} has:`, `${cUserRoles.join(' ')}`); }
        if(cUserIsOwner === true) { userEmbed.addField(`Other Information`, `Is Server Owner`); }

        return message.channel.send(userEmbed);
      }

      // END OF COMMAND
    },
};
