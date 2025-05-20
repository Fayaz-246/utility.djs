"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const error = (level, text) => {
    const colorMap = {
        low: chalk_1.default.cyanBright,
        med: chalk_1.default.yellowBright,
        high: chalk_1.default.redBright,
    };
    const message = `[UTILITY.DJS] ERROR: ${text}`;
    // Print the colored message to stderr for errors
    process.stderr.write(colorMap[level](message) + "\n");
    throw new Error(message);
};
exports.default = error;
