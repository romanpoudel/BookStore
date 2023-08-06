import express from "express";
import connection from "./models/index.js";
import bookRoute from "./routes/bookRoute.js";
import "dotenv/config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("backend is working");
});

app.use("/book", bookRoute);

app.listen(process.env.PORT || 8000, async () => {
  console.log("Server has started");
  try {
    await connection.authenticate();
    connection.sync();
    console.log("Successfully connected to database");
  } catch (err) {
    console.log("Error during connection to database", err);
  }
});
