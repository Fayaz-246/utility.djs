declare class Connector {
    private readonly uri;
    private readonly connection;
    constructor(uri: string);
    onConnection(message: string): void;
    onDisconnect(message: string): void;
    onError(message: string): void;
    private assertMessage;
}
export { Connector };
