"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
class UtilityClient extends discord_js_1.Client {
    EmbedColor;
    interactions;
    buttons;
    modals;
    SelectMenus;
    textCommands;
    interactionArray;
    prefix;
    constructor(obj) {
        if (!obj)
            throw new Error("INVALID CONSTRUCTOR OPTIONS [UTILITY.DJS]");
        if (!obj.Token)
            throw new Error("INVALID TOKEN [UTILITY.DJS]");
        if (!obj.EmbedColor)
            throw new Error("NO EMBED COLOR PROVIDED [UTILITY.DJS]");
        super({
            intents: obj.Intents ?? ["Guilds", "GuildMembers", "GuildMessages"],
            partials: obj.Partials ?? [],
        });
        this.interactions = new discord_js_1.Collection();
        this.buttons = new discord_js_1.Collection();
        this.modals = new discord_js_1.Collection();
        this.SelectMenus = new discord_js_1.Collection();
        this.textCommands = new discord_js_1.Collection();
        this.interactionArray = [];
        this.token = obj.Token;
        this.prefix = obj.Prefix ?? "";
        this.EmbedColor = obj.EmbedColor;
        this.login();
    }
    setPresence(obj) {
        if (!obj)
            throw new Error("INVALID OPTIONS [UTILITY.DJS]");
        if (!obj.state)
            throw new Error("NO STATE PROVIDED [UTILITY.DJS]");
        if (!obj.activities)
            throw new Error("NO ACTIVITIES PROVIDED [UTILITY.DJS]");
        if (!obj.activities.type)
            throw new Error("NO ACTIVITY TYPE PROVIDED [UTILITY.DJS]");
        if (!obj.activities.message)
            throw new Error("NO ACTIVITY TEXT PROVIDED [UTILITY.DJS]");
        if (!obj.sendMessage)
            throw new Error("NO READY MESSAGE [UTILITY.DJS]");
        this.once(discord_js_1.Events.ClientReady, async () => {
            if (!this.user)
                return;
            const inter = (text) => {
                if (!this.user)
                    return "Invalid";
                return text
                    .replace(/{tag}/g, this.user.tag)
                    .replace(/{id}/g, this.user.id)
                    .replace(/{username}/g, this.user.username)
                    .replace(/{servers}/g, this.guilds.cache.size.toString())
                    .replace(/{members}/g, this.users.cache.size.toString());
            };
            console.log(inter(obj.sendMessage));
            this.user.setPresence({
                status: obj.state,
                activities: [
                    {
                        name: inter(obj.activities.message),
                        type: obj.activities.type,
                    },
                ],
            });
        });
    }
    interactionHandler(obj) {
        const { path, clientId, loadingMessage, successMessage } = obj;
        if (!path)
            throw new Error("NO PATH PROVIDED [UTILITY.DJS]");
        if (!clientId)
            throw new Error("NO CLIENT ID PROVIDED [UTILITY.DJS]");
        (async () => {
            const commandFolders = fs_1.default.readdirSync(path);
            for (const folder of commandFolders) {
                const commandFiles = fs_1.default
                    .readdirSync(`${path}/${folder}`)
                    .filter((f) => f.endsWith(".js"));
                for (const file of commandFiles) {
                    const command = require(`../../../.${path}/${folder}/${file}`);
                    if (command.data && command.execute) {
                        this.interactions.set(command.data.name, command);
                        this.interactionArray.push(command.data.toJSON());
                    }
                    else {
                        console.log(chalk_1.default.yellow(`${command} is missing property "data" or "execute"`));
                    }
                }
            }
            if (!this.token)
                throw new Error("Invalid token for REST request.");
            const rest = new discord_js_1.REST({
                version: "9",
            }).setToken(this.token);
            const formattedLoadingMsg = loadingMessage
                ? loadingMessage.replace("{amount}", this.interactionArray.length.toString())
                : `Started refreshing ${this.interactionArray.length} slash commands...`;
            const formattedSuccessMsg = successMessage
                ? successMessage.replace("{amount}", this.interactionArray.length.toString())
                : `Refreshed ${this.interactionArray.length} slash commands!`;
            try {
                console.log(`${chalk_1.default.red(`${formattedLoadingMsg}`)}`);
                await rest.put(discord_js_1.Routes.applicationCommands(clientId), {
                    body: this.interactionArray,
                });
                console.log(`${chalk_1.default.green(`${formattedSuccessMsg}`)}`);
            }
            catch (e) {
                console.log(e);
            }
        })();
    }
    eventHandler(path) {
        if (!path)
            throw new Error("NO PATH PROVIDED [UTILITY.DJS]");
        const eventFiles = fs_1.default.readdirSync(path).filter((f) => f.endsWith(".js"));
        (async () => {
            for (const file of eventFiles) {
                const event = require(`../../../.${path}/${file}`);
                if (event.one) {
                    this.once(event.name, (...args) => event.execute(...args, this));
                }
                else {
                    this.on(event.name, (...args) => event.execute(...args, this));
                }
            }
        })();
    }
    buttonHandler(path) {
        if (!path)
            throw new Error("INVALID PATH [UTILITY.DJS]");
        const buttonFolder = fs_1.default.readdirSync(path);
        for (const file of buttonFolder) {
            const button = require(`../../../.${path}/${file}`);
            if ("execute" in button && "data" in button && button.data.name) {
                this.buttons.set(button.data.name, button);
            }
        }
    }
    modalHandler(path) {
        if (!path)
            throw new Error("INVALID PATH [UTILITY.DJS]");
        const modalFolder = fs_1.default.readdirSync(path);
        for (const file of modalFolder) {
            const modal = require(`../../../.${path}/${file}`);
            if ("execute" in modal && "data" in modal && modal.data.name) {
                this.modals.set(modal.data.name, modal);
            }
        }
    }
    selectMenuHandler(path) {
        if (!path)
            throw new Error("INVALID PATH [UTILITY.DJS]");
        this.SelectMenus = new discord_js_1.Collection();
        const menuFolder = fs_1.default.readdirSync(path);
        for (const file of menuFolder) {
            const menu = require(`../../../.${path}/${file}`);
            if ("execute" in menu && "data" in menu && menu.data.name) {
                this.SelectMenus.set(menu.data.name, menu);
            }
        }
    }
    textCommandHandler(path) {
        if (!path)
            throw new Error("NO PATH PROVIDED [UTILITY.DJS]");
        const commandFolders = fs_1.default.readdirSync(path);
        for (const folder of commandFolders) {
            const commandFiles = fs_1.default
                .readdirSync(`${path}/${folder}`)
                .filter((f) => f.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../../../.${path}/${folder}/${file}`);
                if (command.name && command.execute) {
                    this.textCommands.set(command.name, command);
                }
                else {
                    console.log(chalk_1.default.yellow(`${command} is missing CommandBuilder();`));
                }
            }
        }
    }
}
exports.default = UtilityClient;
