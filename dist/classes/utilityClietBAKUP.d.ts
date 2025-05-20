import { Client, ActivityType, Collection, Partials, BitFieldResolvable, GatewayIntentsString, PresenceStatusData, ColorResolvable } from "discord.js";
interface UtilityClientOptions {
    Token: string;
    EmbedColor: ColorResolvable;
    Intents?: BitFieldResolvable<GatewayIntentsString, number>;
    Partials?: Partials[];
    Prefix?: string;
}
interface PresenceOptions {
    state: PresenceStatusData | undefined;
    activities: {
        type: ActivityType;
        message: string;
    };
    sendMessage: string;
    function?: Function;
}
interface InteractionHandlerOptions {
    path: string;
    clientId: string;
    loadingMessage?: string;
    successMessage?: string;
}
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
export {};
