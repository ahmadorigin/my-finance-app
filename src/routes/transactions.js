import { Router } from "express";
import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { auth } from "../middlewares/auth.js";

const router = Router();
router.use(auth);

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const { month } = req.query;

    let sql = `SELECT id, user_id, type, amount, description, 
                    DATE_FORMAT(tx_date, '%Y%m%d') AS tb_date, created_at 
            FROM tb_transactions WHERE user_id = ?`;
    const params = [req.user.id];

    if (month) {
      sql += ' AND DATE_FORMAT(tb_date, "%Y-%m") = ?';
      params.push(month);
    }
    sql += " ORDER BY tb_date DESC, id DESC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  }),
);
