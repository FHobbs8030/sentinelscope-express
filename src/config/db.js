import mongoose from "mongoose";

import env from "./env.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    console.log(`
=================================
 MongoDB Connected Successfully
=================================
 Database : sentinelscope
=================================
    `);
  } catch (error) {
    console.error(`
=================================
 MongoDB Connection Failed
=================================
 ${error.message}
=================================
    `);

    process.exit(1);
  }
};

export default connectDB;
