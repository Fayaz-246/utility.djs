import mongoose, { Connection, Mongoose } from "mongoose";

class Connector {
  private uri: string;
  private connection: Connection;

  constructor(uri: string) {
    if (!uri) throw new TypeError(`Invalid mongo URI`);
    this.uri = uri;
    mongoose.connect(this.uri);
    this.connection = mongoose.connection;
  }

  public onConnection(message: string): void {
    if (!message) throw new TypeError("No connection message provided");
    this.connection.on("connected", () => {
      console.log(message);
    });
  }

  public onDisconnect(message: string): void {
    if (!message) throw new TypeError("No disconnect message provided");
    this.connection.on("disconnected", () => {
      console.log(message);
    });
  }

  public onError(message: string): void {
    if (!message) throw new TypeError("No error message provided");
    this.connection.on("error", (error) => {
      console.log(message, error);
    });
  }
}

export { Connector };
