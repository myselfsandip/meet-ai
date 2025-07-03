import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwtTokens";
import asyncHandler from "express-async-handler";

export default asyncHandler(async function (req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization!;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized - no token provided'
            });
            return;
        }
        const accessToken = authHeader.split(" ")[1];
        const payload = verifyAccessToken(accessToken);
        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Internal server error')
        })
    }
});