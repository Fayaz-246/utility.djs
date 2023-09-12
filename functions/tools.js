const interactionReciver = async (client, interaction) => {
  if (!client) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (!interaction) throw TypeError("INVALID INTERACTION [UTILITY.DJS]");
  if (interaction.isCommand()) {
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
  }
};

module.exports = { interactionReciver };
