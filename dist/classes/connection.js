"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connector = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class Connector {
    uri;
    connection;
    constructor(uri) {
        if (!uri)
            throw new TypeError(`Invalid mongo URI`);
        this.uri = uri;
        mongoose_1.default.connect(this.uri);
        this.connection = mongoose_1.default.connection;
    }
    onConnection(message) {
        if (!message)
            throw new TypeError("No connection message provided");
        this.connection.on("connected", () => {
            console.log(message);
        });
    }
    onDisconnect(message) {
        if (!message)
            throw new TypeError("No disconnect message provided");
        this.connection.on("disconnected", () => {
            console.log(message);
        });
    }
    onError(message) {
        if (!message)
            throw new TypeError("No error message provided");
        this.connection.on("error", (error) => {
            console.log(message, error);
        });
    }
}
exports.Connector = Connector;
