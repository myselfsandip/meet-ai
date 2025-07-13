import { Router } from "express";
import * as authController from "../controllers/agents.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, authController.getAgents);
router.post('/', authMiddleware, authController.createAgent);


export default router;