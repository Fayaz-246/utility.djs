declare class Connector {
    private uri;
    private connection;
    constructor(uri: string);
    onConnection(message: string): void;
    onDisconnect(message: string): void;
    onError(message: string): void;
}
export { Connector };
