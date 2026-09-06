import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";

import authRouter from "./src/routes/auth.js";
import transactionRouter from "./src/routes/transactions.js";

const app = express();

app.use(express.json());

// Mengizinkan semua origin/domain
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);

app.post("/", (req, res) => {
  res.json({ message: "CORS berhasil dikonfigurasi!" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server jalan di http://localhost:${port}`));
