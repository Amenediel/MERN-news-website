const router = require('express').Router();
const User = require("../model/User")
const bcrypt = require("bcrypt");

/* REGISTER */
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password, salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        })
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }})

/* LOGIN */
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })

        /* IF USER DOESN'T EXIST */
        !user && res.status(400).json("User does not exist")

        /* If MULTIPLE USERS */
        const validate = await bcrypt.compare(req.body.password,user.password)

        /* IF NOT VALID */
        !validate && res.status(400).json("Wrong credentials")

        const { password, ...other } = user._doc
        res.status(200).json(other)
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports = router