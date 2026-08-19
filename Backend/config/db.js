import mongoose from "mongoose";
import dns from "node:dns/promises";

if (process.env.NODE_ENV === "development") {
  dns.setServers(["1.1.1.1", "1.0.0.1"]);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.bgGreen);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
