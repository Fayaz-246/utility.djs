"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connector = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = __importDefault(require("../utils/log"));
class Connector {
    uri;
    connection;
    constructor(uri) {
        if (!uri.trim())
            throw new TypeError("Invalid Mongo URI");
        this.uri = uri;
        mongoose_1.default.connect(this.uri).catch((err) => {
            (0, log_1.default)("high", `MongoDB connection failed:\n${err}`);
        });
        this.connection = mongoose_1.default.connection;
    }
    onConnection(message) {
        this.assertMessage(message, "connection");
        this.connection.once("connected", () => {
            (0, log_1.default)("low", message);
        });
    }
    onDisconnect(message) {
        this.assertMessage(message, "disconnect");
        this.connection.on("disconnected", () => {
            (0, log_1.default)("med", message);
        });
    }
    onError(message) {
        this.assertMessage(message, "error");
        this.connection.on("error", (error) => {
            (0, log_1.default)("high", `${message}\n${error}`);
        });
    }
    assertMessage(message, context) {
        if (!message.trim()) {
            throw new TypeError(`No ${context} message provided`);
        }
    }
}
exports.Connector = Connector;
