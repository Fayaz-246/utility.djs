"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpEmbed = void 0;
const discord_js_1 = require("discord.js");
class HelpEmbed {
    constructor(obj) {
        if (!obj)
            throw new TypeError("Invalid options");
        if (!obj.client)
            throw new Error("Invalid client");
        let _inline = true;
        const client = obj.client;
        if (typeof obj.inline === "boolean") {
            _inline = obj.inline;
        }
        const embed = new discord_js_1.EmbedBuilder()
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
exports.helpEmbed = HelpEmbed;
