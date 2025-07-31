import { Router } from "express";

import * as authController from "../controllers/auth.controller";
import passport from "passport";
import authMiddleware from "../middlewares/authMiddleware";
import { loginLimiter } from "../middlewares/rateLimiting";


const router = Router();


router.get('/health', (req, res) => {
    res.json({
        succes: true
    })
});
router.post('/signup', authController.signUp);
router.post('/signin', loginLimiter, authController.signIn);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.me);
router.post('/refresh', authController.refresh);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], failureRedirect: '/signin' }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);


export default router;