const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./DB/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

dotenv.config();
connectDB();

app.use(express.json());

app.use(require("./Routes/UserRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
