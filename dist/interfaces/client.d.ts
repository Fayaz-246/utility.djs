import { ColorResolvable, BitFieldResolvable, GatewayIntentsString, PresenceStatusData, ActivityType, Partials } from "discord.js";
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
export { UtilityClientOptions, PresenceOptions, InteractionHandlerOptions };
