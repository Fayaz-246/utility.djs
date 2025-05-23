import Client from "../classes/utilityClient";
import { ICmdsObj } from "../utils/ws";

interface DashOps {
  Client: Client;
  Port?: number;
  env: {
    API_KEY: string;
    SESSION_SECRET: string;
  };
}

interface ServeOps {
  // Login + Misc
  getLoginPath?: string;
  get404Path?: string;
  forbidden401Path?: string;

  // Console Help
  consoleCommands?: ICmdsObj[];

  // Main Dashboard
  main?: {
    home?: string;
    info?: string;
    console?: string;
  };
}

export { DashOps, ServeOps };
