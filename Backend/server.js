const app = require("./app");
const dotenv = require("dotenv");
const cloudinary= require("cloudinary");
const databaseConnection = require("./config/database");

//handling uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.msg}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
});

//config
dotenv.config({ path: "Backend/config/config.env" });

//Database Connection
databaseConnection();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  console.log("Shutting down the server due to unhandelled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
