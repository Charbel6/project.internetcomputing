const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const LoginPage = (req, res) => {
    res.render('login', { message: null })
}

const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.render('login', { message: 'Invalid email or password' })
        }

        // Verify the password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.render('login', { message: 'Invalid email or password' })
        }

        // Generate the access token
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: '15m',
        });

        // Save the access token in the session
        req.session.accessToken = accessToken;

        // Generate the refresh token
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN);

        // Save the refresh token to the user document
        user.refreshToken = refreshToken;
        await user.save();
        
        // save username to session
        req.session.username = user.username
        res.redirect('/');
    } catch (error) {
        res.render('login', { message: 'Login failed' })
    }
}

module.exports = { LoginPage, LoginUser }