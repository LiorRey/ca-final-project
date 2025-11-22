import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  try {
    const { email, username, fullName, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists", data: null });
    }

    const user = await User.create({
      email,
      username,
      fullName,
      password,
    });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(201).json({ error: null, data: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: "Signup failed", data: null });
  }
}

export async function login(req, res) {}

export function logout(req, res) {}

export async function getCurrentUser(req, res) {}
