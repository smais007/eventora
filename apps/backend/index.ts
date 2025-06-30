import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/config/db.ts";
import authRoutes from "./src/routes/authRoutes.ts";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
