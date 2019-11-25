const { PREFIX } = require('../config.js');
const Discord = require("discord.js");

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    usage: '[command name]',
    commandType: 'general',
    accessPerm: 4,
    execute(message, args) {
      const { commands } = message.client;
      const helpEmbed = new Discord.MessageEmbed().setColor('#07f51b').setFooter('Help Module');
      const helpEmbedTwo = new Discord.MessageEmbed().setColor('#07f51b').setFooter('Help Module');

      // General Help
      if(!args.length) {
        // Guide for managing Roles!
        helpEmbed.setTitle(`Basic guide to managing which Roles can ping other Roles:`);
        helpEmbed.addField(`\u200B`, `Use the ${PREFIX}role command, under the following syntax:\n\`${PREFIX}role @roleToEdit allow/deny @rolePing\`\n
        Where \`@roleToEdit\` is the Role you want to edit the permissions of;\n
        \`allow/deny\` is where you state if \`@roleToEdit\` should be allowed to ping \`@rolePing\`;\n
        and \`@rolePing\` is the Role Ping your using.\n
        An example can be found under the \`${PREFIX}example\` command.`);

        helpEmbedTwo.setTitle(`A list of all the commands in this Bot!`);
        helpEmbedTwo.setDescription(`Use \`${PREFIX}help command\` for more info on a chosen command!`);  
        // List Role Commands
        helpEmbedTwo.addField(`Role Commands`, commands.filter(command => command.commandType === 'role').map(command => command.name).join(', '));
        // List General Commands
        helpEmbedTwo.addField(`General Commands`, commands.filter(command => command.commandType === 'general').map(command => command.name).join(', '));

        // Send Embeds
        message.channel.send(helpEmbed);
        return message.channel.send(helpEmbedTwo);
      }

      // Specific Command Help

      const name = args[0].toLowerCase();
      const command = commands.get(name);

      if(!command) {
        helpEmbed.addField('\u200B', `Yo, that\'s not a valid command!!`);

        return message.channel.send(helpEmbed);

      } else {
        helpEmbed.setTitle(`${command.name} command:`);

        if(command.aliases) {
          helpEmbed.addField('Aliases', `\u200B ${command.aliases.join(', ')}`);
        }
        if(command.description) {
          helpEmbed.addField('Description', `\u200B ${command.description}`);
        }
        if(command.usage) {
          helpEmbed.addField('Usage', `\u200B ${PREFIX}${command.name} ${command.usage}`);
        }

        return message.channel.send(helpEmbed);
      }

    },
};
