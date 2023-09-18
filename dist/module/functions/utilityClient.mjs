import { utilog } from "./utility-log.mjs";
import fs from "fs";
import { ActivityType, Events, Collection } from "discord.js";
import chalk from "chalk";

export class UtilityClient {
  constructor(obj) {
    if (!obj) throw Error("INVALID CONSTRUCTOR OPTIONS [UTILITY.DJS]");
    if (!obj.client) throw Error("INVALID CLIENT [UTILITY.DJS]");
    if (!obj.token) throw Error("INVALID TOKEN [UTILITY.DJS]");
    if (!obj.EmbedColor) throw Error("NO EMBED COLOR PROVIDED [UTILITY.DJS]");

    console.log(utilog("Started creating Utililty Client...", "yellow"));

    this.client = obj.client;
    this.client.token = obj.token;
    this.client.EmbedColor = obj.EmbedColor;
    this.client.login();

    console.log(utilog("Successfully created Utililty Client!", "green"));
  }

  setPresence(obj) {
    if (!obj) throw Error("INVALID OPTIONS [UTILITY.DJS]");
    if (!obj.state) throw Error("NO STATE PROVIDED [UTILITY.DJS]");
    if (!obj.activities) throw Error("NO ACTIVITIES PROVIDED [UTILITY.DJS]");
    if (!obj.activities.type)
      throw Error("NO ACTIVITY TYPE PROVIDED [UTILITY.DJS]");
    if (!obj.activities.text)
      throw Error("NO ACTIVITY TEXT PROVIDED [UTILITY.DJS]");
    if (!obj.message) throw Error("NO READY MESSAGE [UTILITY.DJS]");
    const bot = this.client;
    if (!["online", "dnd", "invis", "idle"].some((s) => obj.state === s))
      throw Error("INVALID STATE [UTILITY.DJS]");
    if (
      !["playing", "listening", "competing", "watching"].some(
        (s) => obj.activities.type === s
      )
    )
      throw Error("INVALID TYPE OF ACTIVITY [UTILITY.DJS]");
    const state = obj.state.toLowerCase();
    let stateOf;
    if (state === "online") stateOf = state;
    else if (state === "dnd") stateOf = state;
    else if (state === "idle") stateOf = state;
    else if (state === "invis") stateOf = "invisible";
    const type = obj.activities.type.toLowerCase();
    let typeOf;
    if (type === "playing") typeOf = ActivityType.Playing;
    if (type === "listening") typeOf = ActivityType.Listening;
    if (type === "competing") typeOf = ActivityType.Competing;
    if (type === "watching") typeOf = ActivityType.Watching;

    bot.once(Events.ClientReady, async () => {
      console.log(`${chalk.blue(`[CLIENT.DJS]`)}  || ${obj.message}`);
      bot.user.setPresence({
        status: stateOf,
        activities: [
          {
            name: obj.activities.text,
            type: typeOf,
          },
        ],
      });
    });
  }

  interactionHandler(path, clientId) {
    if (!path) throw Error("NO PATH PROVIDED [UTILITY.DJS]");
    if (!clientId) throw Error("NO CLIENT ID PROVIDED [UTILITY.DJS]");
    this.client.interactions = new Collection();
    this.client.interactionArray = [];
    (async () => {
      const { REST } = require("@discordjs/rest");
      const { Routes } = require("discord-api-types/v9");
      const commandFolders = fs.readdirSync(path);
      for (const folder of commandFolders) {
        const commandFiles = fs
          .readdirSync(`${path}/${folder}`)
          .filter((f) => f.endsWith(".js"));
        for (const file of commandFiles) {
          const command = require(`../../.${path}/${folder}/${file}`);
          this.client.interactions.set(command.data.name, command);
          this.client.interactionArray.push(command.data.toJSON());
        }
      }

      const rest = new REST({
        version: "9",
      }).setToken(this.client.token);

      (async () => {
        try {
          console.log(
            `${chalk.red(
              `[CLIENT.DJS]`
            )}  || Started refreshing slash commands...`
          );
          await rest.put(Routes.applicationCommands(clientId), {
            body: this.client.interactionArray,
          });
          console.log(
            `${chalk.green(`[CLIENT.DJS]`)}  || Refreshed slash commands!`
          );
        } catch (e) {
          console.log(e);
        }
      })();
    })();
  }

  eventHandler(path) {
    if (!path) throw Error("NO PATH PROVIDED [UTILITY.DJS]");
    const eventFiles = fs.readdirSync(path).filter((f) => f.endsWith(".js"));

    (async () => {
      for (const file of eventFiles) {
        const client = this.client;
        const event = require(`../../.${path}/${file}`);
        if (event.one) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      }
    })();
  }

  buttonHandler(path) {
    if (!path) throw Error("INVALID PATH [UTILITY.DJS]");
    this.client.buttons = new Collection();
    const buttonFolder = fs.readdirSync(path);
    for (const file of buttonFolder) {
      const button = require(`../../.${path}/${file}`);
      if ("execute" in button && "data" in button && button.data.name) {
        this.client.buttons.set(button.data.name, button);
      }
    }
  }
}
