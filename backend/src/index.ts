import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"
import passport from "passport"


import auth from "./routes/auth";
import { errorHandler } from "./middlewares/errorHandler";
import { configurePassport } from "./config/passport";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173/',
        credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
configurePassport();



app.use("/api/auth", auth);


// Error Handler
app.use(errorHandler);


server.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`);
})