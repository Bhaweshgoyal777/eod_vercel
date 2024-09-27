const mongoose = require("mongoose");

async function connectMongoose() {
  const dbURI =
    "mongodb+srv://ga-prod-1:gamingarcade%40123@ga-prod.b4clw9e.mongodb.net/eod?retryWrites=true&w=majority";
  const options = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
    autoIndex: true,
    // poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    // bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  };

  console.info(`Connecting to ${dbURI}  mode`);

  // Create the database connection
  await mongoose
    .connect(`${dbURI}`, options)
    .then(() => {
      console.info("Mongoose connection done");
    })
    .catch((e) => {
      console.info("Mongoose connection error");
      console.error(e);
    });

  // CONNECTION EVENTS
  // When successfully connected
  mongoose.connection.on("connected", () => {
    console.info("Mongoose connection open to " + dbURI + " in " + " mode");
  });

  // If the connection throws an error
  mongoose.connection.on("error", (err) => {
    console.error("Mongoose default connection error: " + err);
  });

  // When the connection is disconnected
  mongoose.connection.on("disconnected", () => {
    console.info("Mongoose default connection disconnected");
  });

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", () => {
    mongoose.connection.close();
  });
}

module.exports = { connectMongoose };
