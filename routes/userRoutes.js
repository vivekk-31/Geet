import express from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/authMiddleware.js";
import cors from "cors";

// Creating Express application
export const app = express();

// Using CORS for cross-origin requests
app.use(cors());
const router = express.Router();

// Validation rules for user registration
const validateUser = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be 6+ characters").isLength({ min: 6 })
];

// User Registration Route
router.post("/register", validateUser, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please login." });
        }

        // Creating a new user instance
        const newUser = new User({ name, email, password });

        // Saving the user to the database
        await newUser.save();

        // Remove password from the response for security
        const userData = {
            name: newUser.name,
            email: newUser.email,
            _id: newUser._id
        };

        return res.status(201).json({
            message: "User registered successfully.",
            user: userData
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error" });
    }
});

// User Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const loginUser = await User.findOne({ email });

        if (!loginUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await loginUser.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const userData = {
            _id: loginUser._id,
            name: loginUser.name,
            email: loginUser.email,
        };

        const token = generateToken(loginUser._id);

        return res.status(200).json({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            token: token,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// Protected User Profile Route
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

// Exporting the router to be used in the server
export default router;
