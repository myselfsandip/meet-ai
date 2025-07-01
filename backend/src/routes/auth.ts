import { Router } from "express";

import * as authController from "../controllers/auth.controller";
import passport from "passport";
import authMiddleware from "../middlewares/authMiddleware";


const router = Router();


router.get('/health', (req, res) => {
    res.json({
        succes: true
    })
});
router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.post('/refresh', authController.signUp);
router.post('/me', authMiddleware , authController.me);
router.post('/logout', authController.signUp);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], failureRedirect: '/signin' }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);


export default router;