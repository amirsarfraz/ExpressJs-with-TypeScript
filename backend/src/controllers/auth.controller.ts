import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AppDataSource } from "../data-source";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  const existing = await userRepo.findOneBy({ email });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = userRepo.create({ username, email, password: hashed, role });
  await userRepo.save(user);

  res.status(201).json({ message: "User registered successfully" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userRepo.findOneBy({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, "your-secret-key", {
    expiresIn: "1d",
  });

  res.json({ token });
};
