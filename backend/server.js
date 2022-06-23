const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./DB/db");

const app = express();

dotenv.config();
connectDB();

app.use(express.json());

app.use(require("./Routes/UserRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
