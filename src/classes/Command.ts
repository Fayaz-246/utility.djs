class CommandBuilder {
  private _name: string = "";
  private _description: string = "";

  public setName(name: string): this {
    if (!name.trim()) throw new TypeError("Command name cannot be empty");
    this._name = name;
    return this;
  }

  public setDescription(description: string): this {
    if (!description.trim())
      throw new TypeError("Command description cannot be empty");
    this._description = description;
    return this;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string {
    return this._description;
  }
}

export { CommandBuilder };
