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
const PORT = process.env.PORT || 4000;


if (process.env.NODE_ENV !== "production") {
    app.set("trust proxy", 1);
}

const allowedOrigins = [
    'http://localhost:5173',
    'https://uncombustive-overexpressively-farah.ngrok-free.dev', // Allows the ngrok frontend
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// app.use(express.json());
app.use(express.json({
    verify: (req, res, buf) => {
        (req as any).rawBody = buf.toString();
    }
}));

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