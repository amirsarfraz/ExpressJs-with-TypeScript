import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../models/user.model";

export const getUsers = async (_: Request, res: Response) => {
  const users = await AppDataSource.getRepository(User).find();
  res.json(users);
};
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  const userRepo = AppDataSource.getRepository(User);
  const user = userRepo.create({ username, email, password, role });
  await userRepo.save(user);
  res.status(201).json(user);
};
export const updateUser = async (req: Request, res: Response) => {
  
  const userRepo = AppDataSource.getRepository(User);
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    const user = await userRepo.findOneBy({ id: parseInt(id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.password = password ?? user.password;
    user.role = role ?? user.role;

    await userRepo.save(user);
    return res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  console.log("DELETE /users/:id hit", req.params.id); // 👈

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: parseInt(req.params.id) });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await userRepo.remove(user);
  res.status(200).json({ message: "User deleted successfully" });
};
