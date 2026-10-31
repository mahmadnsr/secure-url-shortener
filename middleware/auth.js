import { getUser } from "../services/auth.js";

export function restrictToLoggedInUserOnly(req, res, next) {
    const uid = req.cookies.uid;

    // Agar UID nahi hai, matlab user logged in nahi hai
    if (!uid) {
        return res.redirect("/login");
    }

    // UID ke through Map se user nikalenge
    const user = getUser(uid);
    
    // Agar session expire ho gaya hai ya user nahi mila
    if (!user) {
        res.clearCookie("uid");
        return res.redirect("/login"); // <--- Yahan return lagana zaroori tha
    }
   
    // User ko request object ke andar attach kar rahe hain
    req.user = user;

    next();
}