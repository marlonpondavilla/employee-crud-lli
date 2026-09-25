import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../models/user.model';

const signToken = (payload: { sub: number; username: string; role: string }) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as jwt.SignOptions['expiresIn'],
  });

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await findUserByUsername(username);
    if (!user || !user.IsActive) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.PasswordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ sub: user.Id, username: user.Username, role: user.Role });

    return res.json({
      token,
      user: {
        id: user.Id,
        username: user.Username,
        fullName: user.FullName,
        role: user.Role,
      },
    });
  } catch (err) {
    console.error('[auth.login]', err);
    return res.status(500).json({ message: 'Login failed' });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await findUserByUsername(req.user.username);
    if (!user || !user.IsActive) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      user: {
        id: user.Id,
        username: user.Username,
        fullName: user.FullName,
        role: user.Role,
      },
    });
  } catch (err) {
    console.error('[auth.me]', err);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
};