import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    res.status(201).json({
      message: "Thanks, you can be a great winner!",
      data: { username },
    });
  }),
);

export default router;
