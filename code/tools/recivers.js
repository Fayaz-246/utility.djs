const { InteractionType } = require("discord.js");
/* Start of interaction reciver */
const interactionReciver = async (client, interaction) => {
  if (!client) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (!interaction) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (!interaction.type == InteractionType.ApplicationCommand) return;
  const command = client.interactions.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (e) {
    console.log(e);
    interaction.reply({
      content: `There was an error while executing this interaction.`,
      ephemeral: true,
    });
  }
};
/* End of interaction reciver */
/*-----------------------*/
/* Start of Button Reciver */
const buttonReciver = async (client, interaction) => {
  if (!client) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (!interaction) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (!interaction.isButton()) return;
  const { buttons } = client;
  const { customId } = interaction;
  const button = buttons.get(customId);
  if (!button) return new Error("There is no code for this button");
  try {
    await button.execute(interaction, client);
  } catch (err) {
    interaction.reply({
      content: `There was an error while executing this button.`,
      ephemeral: true,
    });
    console.error(err);
  }
};
/* End of Button Reciver */
/*-----------------------*/
/* Start of Modal Reciver */

const modalReciver = async (client, interaction) => {
  if (!client) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (!interaction) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (!interaction.type == InteractionType.ModalSubmit) return;
  const { modals } = client;
  const { customId } = interaction;
  const modal = modals.get(customId);
  if (!modal) return new Error("No code for this modal");
  try {
    await modal.execute(interaction, client);
  } catch (e) {
    console.log(e);
  }
};

/* End of Modal Reciver */
/*-----------------------*/
/* Start of Select-Menu Reciver */

const selectMenuReciver = async (client, interaction) => {
  if (!client) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (!interaction) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (!interaction.isSelectMenu()) return;

  const { SelectMenus } = client;
  const { customId } = interaction;
  const menu = SelectMenus.get(customId);
  if (!menu) throw new Error(`There is no code for ${customId} select menu.`);
  try {
    await menu.execute(interaction, client);
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  interactionReciver,
  buttonReciver,
  modalReciver,
  selectMenuReciver,
};
