import {
  Client,
  Collection,
  Events,
  REST,
  Routes,
  ColorResolvable,
} from "discord.js";
import {
  UtilityClientOptions,
  PresenceOptions,
  InteractionHandlerOptions,
} from "../interfaces/client";
import chalk from "chalk";
import fs from "fs";
import log from "../utils/log";
import error from "../utils/error";

export default class UtilityClient extends Client {
  public EmbedColor: ColorResolvable;
  public interactions: Collection<string, any>;
  public buttons: Collection<string, any>;
  public modals: Collection<string, any>;
  public SelectMenus: Collection<string, any>;
  public textCommands: Collection<string, any>;
  public interactionArray: Array<any>;

  public prefix: string;

  constructor(obj: UtilityClientOptions) {
    if (!obj) throw new Error("[UTILITY.DJS] INVALID CONSTRUCTOR OPTIONS");
    if (!obj.Token) throw new Error("[UTILITY.DJS] INVALID TOKEN");
    if (!obj.EmbedColor)
      throw new Error("[UTILITY.DJS] NO EMBED COLOR PROVIDED");

    super({
      intents: obj.Intents ?? ["Guilds", "GuildMembers", "GuildMessages"],
      partials: obj.Partials ?? [],
    });

    this.interactions = new Collection();
    this.buttons = new Collection();
    this.modals = new Collection();
    this.SelectMenus = new Collection();
    this.textCommands = new Collection();
    this.interactionArray = [];

    this.token = obj.Token;
    this.prefix = obj.Prefix ?? "";
    this.EmbedColor = obj.EmbedColor;
    this.login();
  }

  setPresence(obj: PresenceOptions) {
    if (!obj) throw new Error("[UTILITY.DJS] INVALID OPTIONS ");
    if (!obj.state) throw new Error("[UTILITY.DJS] NO STATE PROVIDED");
    if (!obj.activities)
      throw new Error("[UTILITY.DJS] NO ACTIVITIES PROVIDED");
    if (!obj.activities.type)
      throw new Error("[UTILITY.DJS] NO ACTIVITY TYPE PROVIDED");
    if (!obj.activities.message)
      throw new Error("[UTILITY.DJS] NO ACTIVITY MESSAGE PROVIDED");
    if (!obj.sendMessage) throw new Error("[UTILITY.DJS] NO READY MESSAGE");

    this.once(Events.ClientReady, async () => {
      if (!this.user) return;
      const inter = (text: string): string => {
        if (!this.user) return "Invalid";
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
        log("med", "Executing ready function...");
        obj.function();
      }
    });
  }

  interactionHandler(obj: InteractionHandlerOptions) {
    const { path, clientId, loadingMessage, successMessage } = obj;

    if (!path) throw new Error("[UTILITY.DJS] NO PATH PROVIDED");
    if (!clientId) throw new Error("[UTILITY.DJS] NO CLIENT ID PROVIDED");

    (async () => {
      const commandFolders = fs.readdirSync(path);

      for (const folder of commandFolders) {
        const commandFiles = fs
          .readdirSync(`${path}/${folder}`)
          .filter((f) => f.endsWith(".js"));

        for (const file of commandFiles) {
          const command = require(`../../../.${path}/${folder}/${file}`);
          if (command.data && command.execute) {
            this.interactions.set(command.data.name, command);
            this.interactionArray.push(command.data.toJSON());
          } else {
            log("med", `${command} is missing property "data" or "execute"`);
          }
        }
      }

      if (!this.token) error("high", "INVALID TOKEN FOR REST REQUEST");

      const rest = new REST({ version: "9" }).setToken(this.token!);

      const formattedLoadingMsg = loadingMessage
        ? loadingMessage.replace(
            "{amount}",
            this.interactionArray.length.toString(),
          )
        : `Started refreshing ${this.interactionArray.length} slash commands...`;

      const formattedSuccessMsg = successMessage
        ? successMessage.replace(
            "{amount}",
            this.interactionArray.length.toString(),
          )
        : `Refreshed ${this.interactionArray.length} slash commands!`;

      try {
        log("med", formattedLoadingMsg);
        await rest.put(Routes.applicationCommands(clientId), {
          body: this.interactionArray,
        });
        log("low", formattedSuccessMsg);
      } catch (e) {
        error("high", (e as Error).message);
      }
    })();
  }

  eventHandler(path: string) {
    if (!path) throw new Error("[UTILITY.DJS] NO PATH PROVIDED");
    const eventFiles = fs.readdirSync(path).filter((f) => f.endsWith(".js"));

    (async () => {
      for (const file of eventFiles) {
        const event = require(`../../../.${path}/${file}`);
        if (event.one) {
          this.once(event.name, (...args) => event.execute(...args, this));
        } else {
          this.on(event.name, (...args) => event.execute(...args, this));
        }
      }
    })();
  }

  buttonHandler(path: string) {
    if (!path) throw new Error("[UTILITY.DJS] INVALID PATH");

    const buttonFolder = fs.readdirSync(path);
    for (const file of buttonFolder) {
      const button = require(`../../../.${path}/${file}`);
      if ("execute" in button && "data" in button && button.data.name) {
        this.buttons.set(button.data.name, button);
      }
    }
  }

  modalHandler(path: string) {
    if (!path) throw new Error("[UTILITY.DJS] INVALID PATH");
    const modalFolder = fs.readdirSync(path);
    for (const file of modalFolder) {
      const modal = require(`../../../.${path}/${file}`);
      if ("execute" in modal && "data" in modal && modal.data.name) {
        this.modals.set(modal.data.name, modal);
      }
    }
  }

  selectMenuHandler(path: string) {
    if (!path) throw new Error("[UTILITY.DJS] INVALID PATH");
    this.SelectMenus = new Collection();
    const menuFolder = fs.readdirSync(path);
    for (const file of menuFolder) {
      const menu = require(`../../../.${path}/${file}`);
      if ("execute" in menu && "data" in menu && menu.data.name) {
        this.SelectMenus.set(menu.data.name, menu);
      }
    }
  }

  textCommandHandler(path: string) {
    if (!path) throw new Error("[UTILITY.DJS] NO PATH PROVIDED");
    const commandFolders = fs.readdirSync(path);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`${path}/${folder}`)
        .filter((f) => f.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../../../.${path}/${folder}/${file}`);
        if (command.data?.name && command.execute) {
          this.textCommands.set(command.data.name, command);
        } else {
          console.log(chalk.yellow(`${command} is missing CommandBuilder();`));
        }
      }
    }
  }
}
