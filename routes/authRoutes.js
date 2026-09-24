const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
router.post('/register', async (req, res) => {
    const{name, email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user) return res.status(400).json({msg: 'User already exists'});
        const salt = await bcrypt.genSalt(10);
        user = new User({name, email, password: await bcrypt.hash(password, salt)});
        await user.save();
        const token = jwt.sign({user: {id: user.id}}, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.json({token});
    } catch(err) {res.status(500).json({msg: err.message});}
});
router.post('/login', async (req, res) => {
    const{email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({msg: 'Invalid credentials'});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({msg: 'Invalid credentials'});
        const token = jwt.sign({user: {id: user.id}}, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.json({token});
    } catch(err) {res.status(500).json({msg: err.message});
    }
});
module.exports = router;