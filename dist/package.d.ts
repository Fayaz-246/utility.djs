import "express-session";
declare module "express-session" {
    interface SessionData {
        user?: {
            test: string;
        };
    }
}
import UtilityClient from "./classes/utilityClient";
import Dash from "./classes/Dashboard";
import { interactionReciver, buttonReciver, modalReciver, selectMenuReciver, textCommandReciver } from "./tools/recivers";
import { helpEmbed } from "./classes/help";
import { Connector } from "./classes/Connection";
import { CommandBuilder } from "./classes/Command";
export { UtilityClient, Dash, Connector, helpEmbed, CommandBuilder, interactionReciver, buttonReciver, modalReciver, selectMenuReciver, textCommandReciver, };
