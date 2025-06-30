import type { Request, Response } from "express";
import type { IUser } from "../models/User";
import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, photoURL } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already used" });

    const hashed = await hashPassword(password);
    const user: IUser = await User.create({
      name,
      email,
      password: hashed,
      photoURL,
    });
    res
      .status(201)
      .json({ token: generateToken((user._id as string).toString()) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne<IUser>({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.json({ token: generateToken((user!._id as string).toString()), user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
