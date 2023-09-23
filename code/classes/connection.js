const mongo = require("mongoose");

class Connector {
  constructor(uri) {
    if (!uri) throw TypeError(`Invalid mongo URI`);
    mongo.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  onConnection(message) {
    if (!message) throw TypeError("No connection message provided");
    mongo.connection.on("connected", () => {
      console.log(message);
    });
  }

  onDisconnect(message) {
    if (!message) throw TypeError("No disconnect message provided");
    mongo.connection.on("disconnected", () => {
      console.log(message);
    });
  }

  onError(message) {
    if (!message) throw TypeError("No error message provided");
    mongo.connection.on("err", (error) => {
      console.log(message, error);
    });
  }
}

module.exports = { Connector };
