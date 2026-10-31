import express from "express";
import { url_shortener, redirect_url, getAnalytics } from "../controllers/urlControllers.js";
import { signUpController, logInController } from "../controllers/userController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

const router = express.Router();

// SignUp
router.post("/signup", signUpController);

// Login
router.post("/login", logInController);

// Short URL create karna (Protected Route)
router.post("/", restrictToLoggedInUserOnly, url_shortener);

// Total clicks dikhana (Protected Route)
router.get("/analytics/:shortURL", restrictToLoggedInUserOnly, getAnalytics);

// Original site par redirect karna
router.get("/:shortURL", redirect_url);

export { router };