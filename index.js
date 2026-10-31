import express from "express";
import { connectMongoDB } from "./config/db.js";
import { router } from "./routes/url_routes.js";
import ejs from "ejs";
import path from "path";
import homeRoute from "./routes/staticRoutes.js";
import { restrictToLoggedInUserOnly } from "./middleware/auth.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// 1. Environment variables load karein
dotenv.config();

const app = express();

// 2. Render ke liye dynamic port aur trust proxy
const PORT = process.env.PORT || 8001;
app.set('trust proxy', 1); 

async function startServer() {
    try {
        // 3. Local URL hata kar .env se Atlas URL uthayein
        await connectMongoDB(process.env.MONGODB_URI);

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve("./public")));

app.use(express.static(path.resolve("./public")));

// Routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/url", router);
app.use("/", homeRoute);

startServer();