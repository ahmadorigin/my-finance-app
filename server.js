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
app.use(
  express.static(path.join(process.cwd(), "public"), {
    setHeaders: (res) => res.setHeader("Cache-Control", "no-store"),
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);

app.post("/", (req, res) => {
  res.json({ message: "CORS berhasil dikonfigurasi!" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: "Terjadi kesalahan server..." });
});

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Halaman tidak ditemukan..." });
  }
  res.status(404).sendFile(path.join(process.cwd(), "public", "404.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server jalan di http://localhost:${port}`));
