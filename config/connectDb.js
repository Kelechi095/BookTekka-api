import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://Kelechi:smsxfa6069@kelechiapi.4se0a78.mongodb.net/ReactQueryMern");
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

