import mongoose from "mongoose";

export const initialiseDBConnection = async () => {
  await mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("db connected");
    })
    .catch((err) => {
      console.error("db connection failed: ", err);
      process.exit(1);
    });
};
