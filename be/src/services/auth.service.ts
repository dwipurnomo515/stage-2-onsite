import { loginDto } from "../dto/login";
import { registerDto } from "../dto/registert";
import prisma from "../prisma/client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



class AuthService {

    async register(data: registerDto) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } })

        if (existingUser) {
            throw new Error('Email already use');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                Profile: {
                    create: {
                        name: data.name
                    }
                }



            },
            include: {
                Profile: true
            }
        });

        const { password, ...result } = newUser;
        const token = jwt.sign(
            result,
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );
        return ({
            user: result,
            token
        })


    }

    async login(data: loginDto) {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            },
            include: {
                Profile: true
            }

        });
        if (!user) {
            throw new Error("User not found")
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
            throw new Error("Email / password salah")
        }

        const { password, ...result } = user;

        const token = jwt.sign(
            result,
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );
        return ({
            user: result,
            token
        })


    }
    async check(user: any) {
        const foundUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { Profile: true }
        });

        if (!foundUser) {
            throw new Error("User not found");
        }

        const { password, ...result } = foundUser;
        return result;
    }

}

export default new AuthService();