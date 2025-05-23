"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const log_1 = __importDefault(require("../utils/log"));
const error_1 = __importDefault(require("../utils/error"));
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
            throw new Error("[UTILITY.DJS] INVALID CONSTRUCTOR OPTIONS");
        if (!obj.Token)
            throw new Error("[UTILITY.DJS] INVALID TOKEN");
        if (!obj.EmbedColor)
            throw new Error("[UTILITY.DJS] NO EMBED COLOR PROVIDED");
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
            throw new Error("[UTILITY.DJS] INVALID OPTIONS ");
        if (!obj.state)
            throw new Error("[UTILITY.DJS] NO STATE PROVIDED");
        if (!obj.activities)
            throw new Error("[UTILITY.DJS] NO ACTIVITIES PROVIDED");
        if (!obj.activities.type)
            throw new Error("[UTILITY.DJS] NO ACTIVITY TYPE PROVIDED");
        if (!obj.activities.message)
            throw new Error("[UTILITY.DJS] NO ACTIVITY MESSAGE PROVIDED");
        if (!obj.sendMessage)
            throw new Error("[UTILITY.DJS] NO READY MESSAGE");
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
            if (obj.function) {
                (0, log_1.default)("med", "Executing ready function...");
                obj.function();
            }
        });
    }
    interactionHandler(obj) {
        const { path, clientId, loadingMessage, successMessage } = obj;
        if (!path)
            throw new Error("[UTILITY.DJS] NO PATH PROVIDED");
        if (!clientId)
            throw new Error("[UTILITY.DJS] NO CLIENT ID PROVIDED");
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
                        (0, log_1.default)("med", `${command} is missing property "data" or "execute"`);
                    }
                }
            }
            if (!this.token)
                (0, error_1.default)("high", "INVALID TOKEN FOR REST REQUEST");
            const rest = new discord_js_1.REST({ version: "9" }).setToken(this.token);
            const formattedLoadingMsg = loadingMessage
                ? loadingMessage.replace("{amount}", this.interactionArray.length.toString())
                : `Started refreshing ${this.interactionArray.length} slash commands...`;
            const formattedSuccessMsg = successMessage
                ? successMessage.replace("{amount}", this.interactionArray.length.toString())
                : `Refreshed ${this.interactionArray.length} slash commands!`;
            try {
                (0, log_1.default)("med", formattedLoadingMsg);
                await rest.put(discord_js_1.Routes.applicationCommands(clientId), {
                    body: this.interactionArray,
                });
                (0, log_1.default)("low", formattedSuccessMsg);
            }
            catch (e) {
                (0, error_1.default)("high", e.message);
            }
        })();
    }
    eventHandler(path) {
        if (!path)
            throw new Error("[UTILITY.DJS] NO PATH PROVIDED");
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
            throw new Error("[UTILITY.DJS] INVALID PATH");
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
            throw new Error("[UTILITY.DJS] INVALID PATH");
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
            throw new Error("[UTILITY.DJS] INVALID PATH");
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
            throw new Error("[UTILITY.DJS] NO PATH PROVIDED");
        const commandFolders = fs_1.default.readdirSync(path);
        for (const folder of commandFolders) {
            const commandFiles = fs_1.default
                .readdirSync(`${path}/${folder}`)
                .filter((f) => f.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../../../.${path}/${folder}/${file}`);
                if (command.data?.name && command.execute) {
                    this.textCommands.set(command.data.name, command);
                }
                else {
                    console.log(chalk_1.default.yellow(`${command} is missing CommandBuilder();`));
                }
            }
        }
    }
}
exports.default = UtilityClient;
