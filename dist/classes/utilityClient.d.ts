import { Client, Collection, ColorResolvable } from "discord.js";
import { UtilityClientOptions, PresenceOptions, InteractionHandlerOptions } from "../interfaces/client";
export default class UtilityClient extends Client {
    EmbedColor: ColorResolvable;
    interactions: Collection<string, any>;
    buttons: Collection<string, any>;
    modals: Collection<string, any>;
    SelectMenus: Collection<string, any>;
    textCommands: Collection<string, any>;
    interactionArray: Array<any>;
    prefix: string;
    constructor(obj: UtilityClientOptions);
    setPresence(obj: PresenceOptions): void;
    interactionHandler(obj: InteractionHandlerOptions): void;
    eventHandler(path: string): void;
    buttonHandler(path: string): void;
    modalHandler(path: string): void;
    selectMenuHandler(path: string): void;
    textCommandHandler(path: string): void;
}
