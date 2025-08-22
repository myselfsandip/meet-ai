import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"
import passport from "passport"


import auth from "./routes/auth";
import agentsRoutes from "./routes/agents";
import meetingsRoutes from "./routes/meetings";
import webhookRoutes from "./routes/webhookRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { configurePassport } from "./config/passport";
import { globalLimiter } from "./middlewares/rateLimiting";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173/',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter); //Rate Limiter

//passport.js Config
app.use(passport.initialize());
configurePassport();


//API ROUTES
app.use("/api/auth", auth);
app.use("/api/agents", agentsRoutes);
app.use("/api/meetings", meetingsRoutes);
app.use("/api/webhook", webhookRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Health 100%"
    })
})


// Error Handler
app.use(errorHandler);


server.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`);
})