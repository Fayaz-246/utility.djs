"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Dash {
    constructor(obj) {
        if (!obj.Port)
            obj.Port = 8080;
        if (!obj.Client.isReady())
            throw new Error("This class should be used after the bot is online [UTILITY.DJS]");
        let app = (0, express_1.default)();
        app.get('/', (req, res) => {
            res.send(`Hmmm lets see if ${obj.Client.user?.username} is online :D`);
        });
        app.listen(obj.Port, () => {
            console.log(`Example app listening on port http://localhost:${obj.Port}/`);
        });
    }
}
exports.default = Dash;
