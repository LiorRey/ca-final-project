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
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(201).json({ error: null, data: user.getSafeUser() });
  } catch (err) {
    res.status(500).json({ error: "Signup failed", data: null });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return invalidCredentials(res);

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) return invalidCredentials(res);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.json({ data: user.getSafeUser(), error: null });
  } catch (err) {
    res.status(500).json({ error: "Login failed", data: null });
  }
}

export function logout(req, res) {}

export async function getCurrentUser(req, res) {}

function invalidCredentials(res) {
  return res.status(401).json({ error: "Invalid credentials", data: null });
}
