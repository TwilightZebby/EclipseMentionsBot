const Sequelize = require('sequelize');
const { sequelize } = require('../bot_modules/constants.js');
const { RoleData } = require('../bot_modules/tables.js');

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

      // Grab all the stored data for the Guild requested
      const roleList = await RoleData.findAll({ where: { guildID: message.guild.id } });

      // In case there is NOTHING
      if(roleList < 1) {
        return message.channel.send(`There is nothing in the Database for this Guild.`);
      }
      
      // Store all the data in an Array for outputting to the User
      var data = [];
      for(let i = 0; i < roleList.length; i++) {
        let uRole = message.guild.roles.get(roleList[i].userRole);
        let pRole = message.guild.roles.resolve(message.guild.roles.get(roleList[i].pingRole));
        let perm = roleList[i].userPermission;
        var uPerm;

        if(perm === 'deny') {
          uPerm = "denied";
        }
        else if(perm === 'allow') {
          uPerm = "allowed";
        }

        let dataString = `\<\@\&` + uRole + `\> is **` + uPerm + `** @mentioning the \<\@\&` + pRole + `\> Role.`;
        data.push(dataString);
      }

      // Output the data
      message.channel.send(data.join(` \n `), { split: true });

      //END OF COMMAND
    },
};
