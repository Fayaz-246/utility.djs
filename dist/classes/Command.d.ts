import { Message } from "discord.js";
import Client from "./utilityClient";
type ExecuteFunction = (message: Message, args: string[], client: Client) => void;
interface CommandOptions {
    name: string;
    description: string;
    execute: ExecuteFunction;
}
declare class CommandBuilder {
    name: string;
    description: string;
    execute: ExecuteFunction;
    constructor(options: CommandOptions);
}
export { CommandBuilder };
