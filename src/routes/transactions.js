import { Router } from "express";
import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { auth } from "../middlewares/auth.js";

const router = Router();
router.use(auth);

// melihat data pengeluaran pemasukan sesuai bulan yang di inputkan
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const { month } = req.query;

    let sql = `SELECT id, user_id, type, amount, description, 
                    DATE_FORMAT(tx_date, '%Y%m%d') AS tx_date, created_at 
            FROM tb_transactions WHERE user_id = ?`;
    const params = [req.user.id];

    if (month) {
      sql += ' AND DATE_FORMAT(tx_date, "%Y-%m") = ?';
      params.push(month);
    }
    sql += " ORDER BY tx_date DESC, id DESC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  }),
);

// Melihat transaksi dengan lebih spesifik
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const [rows] = await pool.query(
      `SELECT id, user_id, type, amount, description, 
            DATE_FORMAT(tx_date, '%Y-%m-%d') AS tx_date, created_at 
      FROM tb_transactions WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id],
    );

    if (!rows.length)
      return res.status(404).json({
        error: "Transaksi tidak ditemukan... -- Gagal Mengambil Data",
      });
    res.json(rows[0]);
  }),
);

// Input new Transaktion
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { type, amount, description, tx_date } = req.body;

    if (!["income", "expense"].includes(type) || !amount || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Type (income/expense) & amount > 0 WAJIB!!!" });
    }

    const [result] = await pool.query(
      "INSERT INTO tb_transactions (user_id, type, amount, description, tx_date) VALUES (?, ?, ?, ?, ?)",
      [
        req.user.id,
        req.body.type,
        req.body.amount,
        req.body.description ?? null,
        req.body.tx_date || null,
      ],
    );

    res.status(201).json({ id: result.insertId, type, amount });
  }),
);

// Edit some Transaktion
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { type, amount, description, tx_date } = req.body;
    const [result] = await pool.query(
      `UPDATE tb_transactions
       SET type = ?, amount = ?, description = ?, tx_date = ?
       WHERE id = ? AND user_id = ?`,
      [
        type,
        amount,
        description ?? null,
        tx_date || null,
        req.params.id,
        req.user.id,
      ],
    );

    if (!result.affectedRows)
      return res
        .status(404)
        .json({ error: "Transaksi tidak ditemukan... -- Gagal Mengedit" });

    res.json({ id: req.params.id, type, amount });
  }),
);

// delete feature for some transaktion
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const [result] = await pool.query(
      `DELETE FROM tb_transactions WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id],
    );

    if (!result.affectedRows)
      return res
        .status(404)
        .json({ error: "Transaksi tidak ditemukan... -- Gagal Menghapus" });

    res.status(201).end();
  }),
);

export default router;
