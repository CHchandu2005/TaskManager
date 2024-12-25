import dotenv from "dotenv";
import express from "express";
import router from "./routes/UserRoute.js"; // Ensure the correct path and file extension
import { connectdb } from "./utils/db.js";
import cors from "cors";
import router1 from "./routes/TaskRoute.js"




dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  methods: "GET,POST,PUT,DELETE", // Allowed methods
  credentials: true // If you're using cookies
}));

// Middleware to parse JSON
app.use(express.json());

// Use the UserRoute for /api/auth
app.use("/api/auth/", router);
app.use("/api/task/",router1);

// A default route
app.get("/", (req, res) => {
  res.send("Hello world");
});

const port = 5000;

connectdb().then(
  app.listen(port, () => {
    console.log(`Listening on the port ${port}`);
  })
)

