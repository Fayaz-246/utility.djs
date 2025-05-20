declare class CommandBuilder {
    private _name;
    private _description;
    setName(name: string): this;
    setDescription(description: string): this;
    get name(): string;
    get description(): string;
}
export { CommandBuilder };
