"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textCommandReciver = exports.selectMenuReciver = exports.modalReciver = exports.buttonReciver = exports.interactionReciver = void 0;
/* Start of interaction reciver */
const interactionReciver = async (client, interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    if (!client)
        throw TypeError("INVALID CLIENT [UTILITY.DJS]");
    if (!interaction)
        throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
    const command = client.interactions.get(interaction.commandName);
    if (!command)
        return;
    try {
        await command.execute(interaction, client);
    }
    catch (e) {
        console.log(e);
        interaction.reply({
            content: `There was an error while executing this interaction.`,
            ephemeral: true,
        });
    }
};
exports.interactionReciver = interactionReciver;
/* End of interaction reciver */
/*-----------------------*/
/* Start of Button Reciver */
const buttonReciver = async (client, interaction) => {
    if (!interaction.isButton())
        return;
    if (!client)
        throw TypeError("INVALID CLIENT [UTILITY.DJS]");
    if (!interaction)
        throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
    const { buttons } = client;
    const { customId } = interaction;
    const button = buttons.get(customId);
    if (!button)
        return new Error("There is no code for this button");
    try {
        await button.execute(interaction, client);
    }
    catch (err) {
        interaction.reply({
            content: `There was an error while executing this button.`,
            ephemeral: true,
        });
        console.error(err);
    }
};
exports.buttonReciver = buttonReciver;
/* End of Button Reciver */
/*-----------------------*/
/* Start of Modal Reciver */
const modalReciver = async (client, interaction) => {
    if (!interaction.isModalSubmit())
        return;
    if (!client)
        throw TypeError("INVALID CLIENT [UTILITY.DJS]");
    if (!interaction)
        throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
    const { modals } = client;
    const { customId } = interaction;
    const modal = modals.get(customId);
    if (!modal)
        return new Error("No code for this modal");
    try {
        await modal.execute(interaction, client);
    }
    catch (e) {
        console.log(e);
    }
};
exports.modalReciver = modalReciver;
/* End of Modal Reciver */
/*-----------------------*/
/* Start of Select-Menu Reciver */
const selectMenuReciver = async (client, interaction) => {
    if (!client)
        throw TypeError("INVALID CLIENT [UTILITY.DJS]");
    if (!interaction)
        throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
    if (!interaction.isStringSelectMenu())
        return;
    const { SelectMenus } = client;
    const { customId } = interaction;
    const menu = SelectMenus.get(customId);
    if (!menu)
        throw new Error(`There is no code for ${customId} select menu.`);
    try {
        await menu.execute(interaction, client);
    }
    catch (e) {
        console.error(e);
    }
};
exports.selectMenuReciver = selectMenuReciver;
/* End of Select-Menu Reciver */
/*-----------------------*/
/* Start of Message Reciver */
const textCommandReciver = async (client, message, prefix) => {
    if (!client)
        throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
    if (!message)
        throw TypeError("INVALID MESSAGE [UTILITY.DJS]");
    if (!prefix)
        throw TypeError("INVALID PREFIX [UTILITY.DJS]");
    if (!message.content.startsWith(prefix) || !message.guild)
        return;
    const args = message.content.slice(prefix.length).split(/ +/g);
    const cmd = args.shift()?.toLowerCase();
    if (!cmd)
        return;
    const command = client.textCommands.get(cmd);
    if (!command)
        return;
    try {
        command.execute(message, args, client);
    }
    catch (e) {
        console.error(e);
        message.reply("Something went wrong while executing this command.");
    }
};
exports.textCommandReciver = textCommandReciver;
