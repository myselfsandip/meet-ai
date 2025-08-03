import { Router } from "express";
import * as authController from "../controllers/agents.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, authController.getAgents);
router.post('/', authMiddleware, authController.createAgent);
router.patch('/', authMiddleware, authController.updateAgent);
router.get('/:id', authMiddleware, authController.getOneAgent);
router.delete('/:id', authMiddleware, authController.deleteAgent);


export default router;