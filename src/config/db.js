import mongoose from "mongoose";

import env from "./env.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(env.mongoUri);

    console.log(`
=================================
 MongoDB Connected Successfully
=================================
 Database : ${connection.connection.name}
=================================
    `);

    return connection;
  } catch (error) {
    console.error(`
=================================
 MongoDB Connection Failed
=================================
 ${error.message}
=================================
    `);

    throw error;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();

  console.log("MongoDB connection closed.");
};

export default connectDB;
