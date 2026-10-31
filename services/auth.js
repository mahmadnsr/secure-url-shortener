import jwt from "jsonwebtoken";

// Secret key .env file se aayegi, warna ek default use hogi
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key_123";

export function setUser(user) {
    // Token banayenge jisme user ki id, name aur email hogi (Valid for 1 Day)
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        SECRET_KEY,
        { expiresIn: "1d" }
    );
}

export function getUser(token) {
    try {
        // Token ko verify karenge
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null; // Agar token galat ya expire ho gaya
    }
}