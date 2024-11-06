import { Request, Response } from "express";
import authService from "../services/auth.service";
import { defaultMaxListeners } from "events";



class AuthController {
    async register(req: Request, res: Response) {
        try {
            const body = req.body;
            const result = await authService.register(body)
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: 'Registration failed' });

        }
    }

    async login(req: Request, res: Response) {
        try {
            const body = req.body
            console.log("Data yang diterima:", req.body); // Tambahkan log untuk melihat data
            const result = await authService.login(body)
            res.status(201).json(result)
        } catch (error) {
            res.status(400).json({ message: 'Login failed' });

        }
    }
    async check(req: Request, res: Response) {
        try {
            const user = (req as any).user
            const result = await authService.check(user)
            res.status(201).json(result)
        } catch (error) {
            res.status(400).json({ message: 'User not found' });

        }
    }
}

export default new AuthController();