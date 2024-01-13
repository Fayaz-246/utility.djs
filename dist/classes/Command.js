"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBuilder = void 0;
class CommandBuilder {
    name;
    description;
    execute;
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.execute = options.execute;
    }
}
exports.CommandBuilder = CommandBuilder;
