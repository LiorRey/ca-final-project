import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export async function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) return res.status(401).send("Unauthorized");

  req.currentUser = currentUser;
  next();
}
