"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandBuilder = void 0;
class CommandBuilder {
    _name = "";
    _description = "";
    setName(name) {
        if (!name.trim())
            throw new TypeError("Command name cannot be empty");
        this._name = name;
        return this;
    }
    setDescription(description) {
        if (!description.trim())
            throw new TypeError("Command description cannot be empty");
        this._description = description;
        return this;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
}
exports.CommandBuilder = CommandBuilder;
