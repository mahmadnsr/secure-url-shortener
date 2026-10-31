import { user_Model } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { setUser } from "../services/auth.js";

export const signUpController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // New improved regex
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/;

        if (!name || !email || !password) {
            return res.render("signup", { error: "All fields are required" });
        }

        if (!nameRegex.test(name)) {
            return res.render("signup", { error: "Name must be 2-50 alphabets only." });
        }

        if (!emailRegex.test(email)) {
            return res.render("signup", { error: "Please provide a valid email address." });
        }

        if (!pwdRegex.test(password)) {
            return res.render("signup", { error: "Password must be 8+ characters with uppercase, lowercase, number, and special char." });
        }

        const existingUser = await user_Model.findOne({ email });
        if (existingUser) {
            return res.render("signup", { error: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user_Model.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.redirect("/login");
    } catch (err) {
        console.error("Signup Error:", err);
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(", ");
            return res.render("signup", { error: message });
        }
        res.status(500).send("Internal Server Error");
    }
};

export const logInController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await user_Model.findOne({ email }).select("+password");

        if (!user) {
            return res.render("login", { error: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { error: "Invalid Email or Password" });
        }

        const token = setUser(user);
        res.cookie("uid", token, { httpOnly: true });

        return res.redirect("/");
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).send("Internal Server Error");
    }
};
