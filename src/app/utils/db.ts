import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URL + "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cachedConnection: mongoose.Connection;

async function db() {
  if (cachedConnection) {
    return cachedConnection;
  }
  try {
    // TODO
    // run yarn i to downgrade mongoose
    await mongoose.connect(MONGODB_URI, {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
    cachedConnection = mongoose.connection;
    return cachedConnection;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export default db;
