import { Interaction, Message } from "discord.js";
import Client from "../classes/utilityClient";
declare const interactionReciver: (client: Client, interaction: Interaction) => Promise<void>;
declare const buttonReciver: (client: Client, interaction: Interaction) => Promise<Error | undefined>;
declare const modalReciver: (client: Client, interaction: Interaction) => Promise<Error | undefined>;
declare const selectMenuReciver: (client: Client, interaction: Interaction) => Promise<void>;
declare const textCommandReciver: (client: Client, message: Message, prefix: string) => Promise<void>;
export { interactionReciver, buttonReciver, modalReciver, selectMenuReciver, textCommandReciver, };
