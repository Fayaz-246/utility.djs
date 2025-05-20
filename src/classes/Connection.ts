import mongoose, { Connection } from "mongoose";
import log from "../utils/log";

class Connector {
  private readonly uri: string;
  private readonly connection: Connection;

  constructor(uri: string) {
    if (!uri.trim()) throw new TypeError("Invalid Mongo URI");

    this.uri = uri;
    mongoose.connect(this.uri).catch((err) => {
      log("high", `MongoDB connection failed:\n${err}`);
    });

    this.connection = mongoose.connection;
  }

  public onConnection(message: string): void {
    this.assertMessage(message, "connection");
    this.connection.once("connected", () => {
      log("low", message);
    });
  }

  public onDisconnect(message: string): void {
    this.assertMessage(message, "disconnect");
    this.connection.on("disconnected", () => {
      log("med", message);
    });
  }

  public onError(message: string): void {
    this.assertMessage(message, "error");
    this.connection.on("error", (error) => {
      log("high", `${message}\n${error}`);
    });
  }

  private assertMessage(message: string, context: string): void {
    if (!message.trim()) {
      throw new TypeError(`No ${context} message provided`);
    }
  }
}
export { Connector };
