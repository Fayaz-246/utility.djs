import {
  Client,
  ActivityType,
  Collection,
  Partials,
  BitFieldResolvable,
  GatewayIntentsString,
  Events,
  PresenceStatusData,
  REST,
  Routes,
  ColorResolvable,
} from "discord.js";
import chalk from "chalk";
import fs from "fs";

interface UtilityClientOptions {
  Token: string;
  EmbedColor: ColorResolvable;
  Intents?: BitFieldResolvable<GatewayIntentsString, number>;
  Partials?: Partials[];
  Prefix?: string;
}

interface PresenceOptions {
  state: PresenceStatusData | undefined;
  activities: {
    type: ActivityType;
    message: string;
  };
  sendMessage: string;
}

interface InteractionHandlerOptions {
  path: string;
  clientId: string;
  loadingMessage?: string;
  successMessage?: string;
}

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
    if (!obj) throw new Error("INVALID CONSTRUCTOR OPTIONS [UTILITY.DJS]");
    if (!obj.Token) throw new Error("INVALID TOKEN [UTILITY.DJS]");
    if (!obj.EmbedColor)
      throw new Error("NO EMBED COLOR PROVIDED [UTILITY.DJS]");

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
    if (!obj) throw new Error("INVALID OPTIONS [UTILITY.DJS]");
    if (!obj.state) throw new Error("NO STATE PROVIDED [UTILITY.DJS]");
    if (!obj.activities)
      throw new Error("NO ACTIVITIES PROVIDED [UTILITY.DJS]");
    if (!obj.activities.type)
      throw new Error("NO ACTIVITY TYPE PROVIDED [UTILITY.DJS]");
    if (!obj.activities.message)
      throw new Error("NO ACTIVITY TEXT PROVIDED [UTILITY.DJS]");
    if (!obj.sendMessage) throw new Error("NO READY MESSAGE [UTILITY.DJS]");

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
    });
  }

  interactionHandler(obj: InteractionHandlerOptions) {
    const { path, clientId, loadingMessage, successMessage } = obj;

    if (!path) throw new Error("NO PATH PROVIDED [UTILITY.DJS]");
    if (!clientId) throw new Error("NO CLIENT ID PROVIDED [UTILITY.DJS]");

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
            console.log(
              chalk.yellow(`${command} is missing property "data" or "execute"`)
            );
          }
        }
      }

      if (!this.token) throw new Error("Invalid token for REST request.");
      const rest = new REST({
        version: "9",
      }).setToken(this.token);

      const formattedLoadingMsg = loadingMessage
        ? loadingMessage.replace(
            "{amount}",
            this.interactionArray.length.toString()
          )
        : `Started refreshing ${this.interactionArray.length} slash commands...`;

      const formattedSuccessMsg = successMessage
        ? successMessage.replace(
            "{amount}",
            this.interactionArray.length.toString()
          )
        : `Refreshed ${this.interactionArray.length} slash commands!`;

      try {
        console.log(`${chalk.red(`${formattedLoadingMsg}`)}`);
        await rest.put(Routes.applicationCommands(clientId), {
          body: this.interactionArray,
        });
        console.log(`${chalk.green(`${formattedSuccessMsg}`)}`);
      } catch (e) {
        console.log(e);
      }
    })();
  }

  eventHandler(path: string) {
    if (!path) throw new Error("NO PATH PROVIDED [UTILITY.DJS]");
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
    if (!path) throw new Error("INVALID PATH [UTILITY.DJS]");

    const buttonFolder = fs.readdirSync(path);
    for (const file of buttonFolder) {
      const button = require(`../../../.${path}/${file}`);
      if ("execute" in button && "data" in button && button.data.name) {
        this.buttons.set(button.data.name, button);
      }
    }
  }

  modalHandler(path: string) {
    if (!path) throw new Error("INVALID PATH [UTILITY.DJS]");
    const modalFolder = fs.readdirSync(path);
    for (const file of modalFolder) {
      const modal = require(`../../../.${path}/${file}`);
      if ("execute" in modal && "data" in modal && modal.data.name) {
        this.modals.set(modal.data.name, modal);
      }
    }
  }

  selectMenuHandler(path: string) {
    if (!path) throw new Error("INVALID PATH [UTILITY.DJS]");
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
    if (!path) throw new Error("NO PATH PROVIDED [UTILITY.DJS]");
    const commandFolders = fs.readdirSync(path);
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`${path}/${folder}`)
        .filter((f) => f.endsWith(".js"));

      for (const file of commandFiles) {
        const command = require(`../../../.${path}/${folder}/${file}`);
        if (command.name && command.execute) {
          this.textCommands.set(command.name, command);
        } else {
          console.log(chalk.yellow(`${command} is missing CommandBuilder();`));
        }
      }
    }
  }
}
