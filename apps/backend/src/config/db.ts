import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connetDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL as string);
    console.log("MongoDB connected: " + conn.connection.host);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connetDB;
