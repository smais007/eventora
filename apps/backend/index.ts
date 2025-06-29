// apps/backend/index.ts
import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (req, res) => res.send("Hello from Bun + Express"));

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
