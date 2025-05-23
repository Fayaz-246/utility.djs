"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupConsoleWS = setupConsoleWS;
const ws_1 = __importStar(require("ws"));
const log_1 = __importDefault(require("./log"));
function setupConsoleWS(server, commands) {
    if (!commands)
        throw Error("[UTILITY.DJS INTERNAL ERROR]  Invalid Commands Obj Provided");
    const wss = new ws_1.WebSocketServer({ server, path: "/ws/console" });
    wss.on("connection", (ws) => {
        (0, log_1.default)("low", "[WS] Console connected.");
        const writeToClient = (data) => {
            if (ws.readyState === ws_1.default.OPEN) {
                ws.send(data.toString());
            }
        };
        // Backup original stdout/stderr write methods
        const originalStdoutWrite = process.stdout.write.bind(process.stdout);
        const originalStderrWrite = process.stderr.write.bind(process.stderr);
        // Patch stdout
        process.stdout.write = ((chunk, ...args) => {
            writeToClient(chunk);
            return originalStdoutWrite(chunk, ...args);
        });
        // Patch stderr
        process.stderr.write = ((chunk, ...args) => {
            writeToClient(chunk);
            return originalStderrWrite(chunk, ...args);
        });
        // Pipe browser input to process.stdin
        ws.on("message", (msg) => {
            process.stdin.emit("data", msg);
        });
        ws.on("close", () => {
            (0, log_1.default)("med", "[WS] Console disconnected.");
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
        }
        else {
            process.stdout.write("Invalid command.\n");
        }
    });
}
