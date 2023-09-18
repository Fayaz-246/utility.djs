# Utility.djs

<div>
<a herf="https://www.npmjs.com/package/utility.djs"><img src="https://img.shields.io/npm/dt/utility.djs.svg?maxAge=3600" alt="DOWNLOADS"></a>
  <a href="https://www.npmjs.com/package/utility.djs"><img src="https://img.shields.io/npm/v/utility.djs.svg?maxAge=3600" alt="NPM version" /></a>  
</div>

## About Utility.djs

> Made for setting up a discord.js bot in the quickest way!
> UPDATE! ADDED MJS SUPPORT

## Installation

```css
npm install utility.djs discord.js
```

## Usage

### Creating a utility client

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

Simple as that!

### Setting presence

```js
utilClient.setPresence({
  message: `Bot ready!`, //  What message it will log when the bot is online
  state: "idle", // States such as "online", "dnd", "invis", "idle"
  activities: {
    type: "watching", // Current Types "playing", "listening", "competing", "watching"
    text: "youtube", // What it will display after the Type in this code it would display Watching youtube
  },
});
```

### Creating Event, Interaction, Button handlers

```js
utilClient.interactionHandler(`./commands`, "your client id"); // ./commands is the path. FS TYPE PATH
utilClient.eventHandler(`./events`); // Same here
utilClient.buttonHandler(`./buttons`); // also here
```

## Handling interactions & buttons

> Create an event in your events folder with the following code

```js
const { interactionReciver, buttonReciver } = require("utility.djs");

module.exports = {
  name: `interactionCreate`,
  async execute(interaction, client) {
    await interactionReciver(client, interaction);
    /* If you have buttons with your utilClient */
    await buttonReciver(client, interaction);
  },
};
```

## Connecting to mongo

```js
const { Connection } = require("utility.djs");
const connection = new Connection("YOUR MONGO URI");
connection.connect();
connection.onConnection("The message to log when connect to mongo.");
connection.onDisconnect("The message to log when disconnect from mongo.");
connection.onError("The message to log when an error occurs.");
```

## Format of button and interaction files

### Interaction

```js
const { SlashcommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashcommandBuilder().setName("").setDescription(), // Just the discord.js slash command builder.
  async execute(interaction, client) {
    // your code
  },
};
```

### Buttons

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

## Thats it! You can now make commands as you want.

- Note the command handler uses sub folders while the event handler does not!
