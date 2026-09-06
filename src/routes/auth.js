import { json, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return (
        res.status(400),
        json({ error: "Username dan Password wajib di isi!" })
      );
    }

    const [exists] = await pool.query(
      "SELECT id FROM tb_users WHERE username = ?",
      [username],
    );

    if (exists.length)
      return res.status(409).json({ error: "Username sudah di pakai..." });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO tb_users (username, password_hash) VALUES (?, ?)",
      [username, password_hash],
    );

    res.status(201).json({ id: result.insertId, username });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      "SELECT * FROM tb_users WHERE username = ?",
      [req.body.username],
    );

    const user = rows[0];
    if (!user)
      return res.status(401).json({ error: "Username tidak ditemukan..." });

    const match = await bcrypt.compare(req.body.password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Password Salah!!!" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    res.json({ token });
  }),
);

export default router;
