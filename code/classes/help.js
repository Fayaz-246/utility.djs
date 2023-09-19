const { EmbedBuilder } = require("discord.js");

class helpEmbed {
  constructor(obj) {
    if (!obj) throw new TypeError("Invalid options");
    if (!obj.client) throw new Error("Invalid client");
    let _inline;
    const client = obj.client;
    if (!obj.inline) _inline = true;
    if (obj.inline && typeof obj.inline != "boolean")
      throw new TypeError("Inline is boolean");
    if (obj.inline === false) _inline = false;
    if (obj.inline === true) _inline = true;

    const embed = new EmbedBuilder()
      .setTitle(`${client.user.username} Commands.`)
      .setTimestamp()
      .setColor(client.EmbedColor || "#2f3136");
    for (const command of client.interactionArray) {
      embed.addFields({
        name: `Command - \`\`\`${command.name}\`\`\``,
        value: `Description - \`\`\`${command.description}\`\`\``,
        inline: _inline,
      });
    }
    return embed;
  }
}

module.exports = { helpEmbed };
