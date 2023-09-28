const { Client, Message } = require("discord.js");

/**
 *  @param { Message } message
 *  @param {String[]} args
 *  @param {Client} client
 */
function executeFunction(message, args, client) {}

class CommandBuilder {
  /**
   *  @typedef {{name: string, description, execute: executeFunction}} CommandOptions
   *  @param {CommandOptions} options
   */
  constructor(options) {
    this.name = options.name;
    this.description = options.description;
    this.execute = options.execute;
  }
}

module.exports = { CommandBuilder };
