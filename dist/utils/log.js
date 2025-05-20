"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const log = (uni, text) => {
    const table = {
        low: chalk_1.default.cyan,
        med: chalk_1.default.yellow,
        high: chalk_1.default.redBright,
    };
    console.log(table[uni]("[UTILITY.DJS] ") + chalk_1.default.white.bold(`${text}`));
};
exports.default = log;
