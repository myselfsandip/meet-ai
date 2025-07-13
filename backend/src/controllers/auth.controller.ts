import { Request, Response, NextFunction } from 'express';
import asyncHandler from "express-async-handler";
import { eq } from 'drizzle-orm';
import bcrypt from "bcrypt";
import { db } from "../db"
import { signInSchema, signUpSchema } from '../validations/auth';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtTokens';
import { users } from '../db/schema';





export const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parsedPayload = signUpSchema.safeParse(req.body);
    if (!parsedPayload.success) {
        res.status(400).json({
            success: false,
            message: 'Invalid Credentials'
        });
        return;
    }
    const { name, email, password } = parsedPayload.data;
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser[0]) {
        res.status(400).json({
            success: false,
            message: 'User already exists'
        });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const [newUser] = await db.insert(users).values([{ name: name, email: email, password: hashedPassword }]).returning();
    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);
    await db.update(users).set({ refreshToken: refreshToken }).where(eq(users.id, newUser.id));
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    });
    res.status(200).json({
        success: true,
        message: 'Sign Up Successfull',
        accessToken,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        }
    })
});


export const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parsedPayload = signInSchema.safeParse(req.body);
    if (!parsedPayload.success) {
        res.status(400).json({
            success: false,
            message: 'Invalid Credentials'
        });
        return;
    }
    const { email, password } = parsedPayload.data;
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user[0]) {
        res.status(404).json({
            success: false,
            message: 'User not found!'
        });
        return;
    }
    const validatePassword: boolean = await bcrypt.compare(password, user[0].password!);
    if (!validatePassword) {
        res.status(400).json({
            success: false,
            message: 'Invalid Password'
        });
        return;
    }
    const accessToken = generateAccessToken(user[0].id);
    const refreshToken = generateRefreshToken(user[0].id);
    await db.update(users).set({ refreshToken: refreshToken }).where(eq(users.id, user[0].id));
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    });
    res.status(200).json({
        success: true,
        message: 'Sign In Successfull',
        accessToken,
        user: {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
        }
    })
});


export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const payload = verifyRefreshToken(refreshToken);
        await db.update(users).set({ refreshToken: null }).where(eq(users.id, payload.userId));
    }
    res.clearCookie('refreshToken');
    res.status(200).json({
        success: true,
        message: 'Logout Successfull'
    })
});



export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        res.status(401).json({ success: false, message: 'Refresh token required' });
        return;
    }
    const payload = verifyRefreshToken(token);

    if (!payload.userId) {
        res.status(401).json({
            success: false,
            message: 'Invalid Token'
        });
        return;
    }

    const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
    if (!user[0]) {
        res.status(401).json({
            success: false,
            message: 'Invalid Token'
        });
        return;
    }

    if (user[0].refreshToken !== token) {
        res.status(401).json({
            success: false,
            message: 'Invalid Token'
        });
        return;
    }

    const newAccessToken = generateAccessToken(user[0].id);

    res.status(200).json({
        success: true,
        message: 'Access Token Generated Successfully',
        token: newAccessToken
    });

});


export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const existingUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const refreshToken = generateRefreshToken(existingUser[0].id);
    await db.update(users).set({ refreshToken }).where(eq(users.id, existingUser[0].id));
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    });
    // Redirect to page where frontend can request access token via cookie
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
});


export const me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.userId;
    const user_db = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = user_db[0];
    res.status(200).json({
        success: true,
        message: 'Valid User',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    });
});