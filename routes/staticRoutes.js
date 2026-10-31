import express from "express";
import { url_model } from "../models/urlModel.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", restrictToLoggedInUserOnly, async (req, res) => {
    try {
        const all_url = await url_model.find({
            createdBy: req.user._id,
        }).sort({ createdAt: -1 });

        return res.render("home", {
            urls: all_url,
            user: req.user
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.get("/login", (req, res) => {
    return res.render("login");
});

// NAYA ROUTE: Logout
router.get("/logout", (req, res) => {
    res.clearCookie("uid");
    return res.redirect("/login");
});

export default router;
