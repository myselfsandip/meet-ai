import { Router } from "express";
import * as meetingsController from "../controllers/meetings.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get('/token', authMiddleware, meetingsController.generateToken);
router.get('/', authMiddleware, meetingsController.getMeetings);
router.post('/', authMiddleware, meetingsController.createMeeting);
router.patch('/', authMiddleware, meetingsController.updateMeeting);
router.get('/:id', authMiddleware, meetingsController.getOneMeeting);
router.delete('/:id', authMiddleware, meetingsController.deleteMeeting);


export default router;