import { Server as HTTPServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import log from "./log";

export type ICmdsObj = {
  name: string;
  res: string;
};

export function setupConsoleWS(server: HTTPServer, commands: ICmdsObj[]): void {
  if (!commands)
    throw Error("[UTILITY.DJS INTERNAL ERROR]  Invalid Commands Obj Provided");
  const wss = new WebSocketServer({ server, path: "/ws/console" });

  wss.on("connection", (ws: WebSocket) => {
    log("low", "[WS] Console connected.");

    const writeToClient = (data: Buffer | string): void => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data.toString());
      }
    };

    // Backup original stdout/stderr write methods
    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    const originalStderrWrite = process.stderr.write.bind(process.stderr);

    // Patch stdout
    process.stdout.write = ((chunk: any, ...args: any[]): boolean => {
      writeToClient(chunk);
      return originalStdoutWrite(chunk, ...args);
    }) as typeof process.stdout.write;

    // Patch stderr
    process.stderr.write = ((chunk: any, ...args: any[]): boolean => {
      writeToClient(chunk);
      return originalStderrWrite(chunk, ...args);
    }) as typeof process.stderr.write;

    // Pipe browser input to process.stdin
    ws.on("message", (msg: WebSocket.RawData) => {
      process.stdin.emit("data", msg);
    });

    ws.on("close", () => {
      log("med", "[WS] Console disconnected.");

      // Restore original stdout/stderr
      process.stdout.write = originalStdoutWrite;
      process.stderr.write = originalStderrWrite;
    });
  });

  process.stdin.on("data", (data) => {
    const command = data.toString().trim();
    console.log(`> ${command}`);

    const found = commands.find((x) => x.name === command);

    if (found) {
      process.stdout.write(`${found.res}\n`);
    } else {
      process.stdout.write("Invalid command.\n");
    }
  });
}
