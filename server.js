import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const port = 3000;

// Mengizinkan semua origin/domain
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "CORS berhasil dikonfigurasi!" });
});

app.listen(port, () => console.log(`Server jalan di http://localhost:${port}`));
