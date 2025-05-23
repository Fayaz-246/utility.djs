import { Server as HTTPServer } from "http";
export type ICmdsObj = {
    name: string;
    res: string;
};
export declare function setupConsoleWS(server: HTTPServer, commands: ICmdsObj[]): void;
