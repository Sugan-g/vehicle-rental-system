import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Helper to generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword, // ✅ Use 'password', not 'passwordHash'
            role,
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error during registration" });
    }
};

// Login User
export const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(" Login Request Received:", req.body); // <-- add this

        const user = await User.findOne({ email });
        console.log("User Found:", user); // <-- add this

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isMatch); // <-- add this

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Error in authUser:", error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};

