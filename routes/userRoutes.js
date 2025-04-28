import express from "express"
import { check, validationResult } from "express-validator"
import User from "../models/user.js"
import generateToken from "../utils/generateToken.js"
import { protect } from "../middleware/authMiddleware.js"
import cors from 'cors'
export const app = express()

app.use(cors())
const router = express.Router()

const validateUser = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email is required").isEmail(),
    check("password", "Password must be 6+ characters").isLength({ min: 6 })
]

router.post("/register", validateUser, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please login." })
        }

        //if there is no existing user, create a new user instance
        const newUser = new User({ name, email, password })

        //save the instance in mongodb 
        await newUser.save();

        //remove password before sending the response(safety protocol)
        const userData = {
            name: newUser.name,
            email: newUser.email,
            _id: newUser._id
        };


        res.status(200).json({
            message: "User registered successfully.",
            user: userData
        })

    }

    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }

})

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {
        const loginUser = await User.findOne({ email })

        if (!loginUser) {
            res.status(401).json({ message: "Invalid credentials" })
        }

        const isMatch = await loginUser.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const userData = {
            _id: loginUser._id,
            name: loginUser.name,
            email: loginUser.email,
        }

        const token = generateToken(loginUser._id)
        res.status(200).json({
            _id:userData._id,
            name:userData.name, 
            email:userData.email,
            token:token,
        })      

    }
    catch (error) {
        console.error(error.messaage)
        res.status(400).json({ message: "Internal server error." })
    }
})

router.get('/profile', protect, (req, res)=>{
    res.json(req.user)
})



export default router  