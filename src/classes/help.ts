import { EmbedBuilder } from "discord.js";
import Client from "./utilityClient";

class HelpEmbed {
  constructor(obj: { client: Client; inline?: boolean }) {
    if (!obj) throw new TypeError("Invalid options");
    if (!obj.client) throw new Error("Invalid client");

    let _inline = true;
    const client = obj.client;

    if (typeof obj.inline === "boolean") {
      _inline = obj.inline;
    }

    const embed = new EmbedBuilder()
      .setTitle(`${client.user?.username} Commands.`)
      .setTimestamp()
      .setColor(client.EmbedColor || "#2f3136");

    for (const command of client.interactionArray) {
      embed.addFields({
        name: `Command - \`${command.name}\``,
        value: `Description - \`${command.description}\``,
        inline: _inline,
      });
    }

    return embed;
  }
}

export { HelpEmbed as helpEmbed };
