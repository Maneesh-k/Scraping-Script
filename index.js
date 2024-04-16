const express = require("express");
const {route:scraping} = require("./src/controller/scraping.controller");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");

  console.log(err.name, err.message);

  process.exit(1);
});

const app = express();

app.use(scraping)

const port = 1111;

const server = app.listen(port, async () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");

  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");

  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
