import { Message } from "discord.js";
import Client from "./utilityClient";

type ExecuteFunction = (
  message: Message,
  args: string[],
  client: Client
) => void;

interface CommandOptions {
  name: string;
  description: string;
  execute: ExecuteFunction;
}

class CommandBuilder {
  public name: string;
  public description: string;
  public execute: ExecuteFunction;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.execute = options.execute;
  }
}

export { CommandBuilder };
