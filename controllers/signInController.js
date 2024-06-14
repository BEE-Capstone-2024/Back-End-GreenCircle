require('dotenv').config()
const UserAuth = require("../models/User")

const jwt = require("jsonwebtoken")

const getUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            res.status(400)
            return next(new Error("Email and password are required"))
        }

        const user = await UserAuth.findOne({ email })
        if (!user) {
            res.status(404)
            return next(new Error("User does not exist"))
        }

        const isValidPassword = await user.validatePassword(password)
        if (!isValidPassword) {
            res.status(400)
            return next(new Error("Invalid password"))
        }

        const userObject = user.toObject()
        delete userObject.password

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24
        })

        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            user: userObject,
            token
        })
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

module.exports = {
    getUser,
}