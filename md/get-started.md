# Getting started with Utility.djs

## Installing utility.djs and discord.js

> In the terminal

```
npm install utility.djs discord.js
```

## Creating the bot

> **In your main file probbably `index.js`**

```js
const { Client, GatewayIntentBits } = require("discord.js");
const { UtilityClient } = require("utility.djs");

const djsClient = new Client({
  intents: Object.keys(GatewayIntentBits),
});

const utilClient = new UtilityClient({
  client: djsClient,
  token: "your token",
  EmbedColor: "#FFFFFF", // Embed Color for the bot
});
```

> _Token should be replaced with your bots token and embed color can be any hex color_

### Setting the bots presence

```js
utilClient.setPresence({
  message: `Bot ready!`,
  state: "idle",
  activities: {
    type: "watching",
    text: "youtube",
  },
});
```

> _Message is the text that gets logged when the bot gets online._

> _State is the state of the bot usable state types `dnd , invis , online , idle`_

> _Type's are `playing, listening, competing, watching`_

> _Text is the message after the type._

### Creating Handlers

```js
utilClient.interactionHandler(`./commands`, "your client id");
utilClient.eventHandler(`./events`);
utilClient.buttonHandler(`./buttons`);
utilClient.modalHandler(`./modals`);
```

> **All the file paths should be fs type not relative like the one you use with `require()`**

### Handling interactions

> Create an event in your events folder with the following code

```js
const {
  interactionReciver,
  buttonReciver,
  modalReciver,
} = require("utility.djs");

module.exports = {
  name: `interactionCreate`,
  async execute(interaction, client) {
    await interactionReciver(client, interaction);
    /* If you have buttons with your utilClient */
    await buttonReciver(client, interaction);
    /* If you have modals with your utilClient */
    await modalReciver(client, interaction);
  },
};
```

> _or if you don't use the event handler you can put that code with the `client.on("interactionCreate")....`_

### Format of the files

#### Interaction

```js
const { SlashcommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashcommandBuilder().setName("").setDescription(), // Just the discord.js slash command builder.
  async execute(interaction, client) {
    // your code
  },
};
```

#### Buttons & Modals

```js
module.exports = {
  data: {
    name: "button customid",
  },
  async execute(interaction, client) {
    // Your code
  },
};
```

## Connecting to mongoDB

```js
const { Connection } = require("utility.djs");
const connection = new Connection("YOUR MONGO URI");
connection.connect();
connection.onConnection("The message to log when connect to mongo.");
connection.onDisconnect("The message to log when disconnect from mongo.");
connection.onError("The message to log when an error occurs.");
```

## Thats it! You can now make commands as you want.

- Note the command handler uses sub folders while the event handler does not!
