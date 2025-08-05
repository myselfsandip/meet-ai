import { Router } from "express";
import * as agentsController from "../controllers/agents.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get('/', authMiddleware, agentsController.getAgents);
router.post('/', authMiddleware, agentsController.createAgent);
router.patch('/', authMiddleware, agentsController.updateAgent);
router.get('/:id', authMiddleware, agentsController.getOneAgent);
router.delete('/:id', authMiddleware, agentsController.deleteAgent);


export default router;