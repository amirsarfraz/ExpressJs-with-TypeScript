import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../models/user.model';


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
