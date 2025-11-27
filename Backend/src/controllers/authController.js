const bcrypt = require('bcrypt');
const db = require('../database/connection'); // your db.js
const User = db.users;  // ✅ now User.findOne() works
const generateToken = require('../services/generateJwtToken');


// POST/api/auth/register

const registerUser = async (req, res)=>{

    try{

        const { name, email, password, role } = req.body;
        
         if (!name || !email || !password) {
            return res.status(400).json({ 
                 message: 'Please provide name, email and password' 
            });
        }

        // checks user via email
        const existingUser = await User.findOne({
             where: {
                 email
                 }
                 });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email!' 
            });
        }

         const hashedPassword = await bcrypt.hash(password, 10);

         const user = await User.create({
            name : name,
            email : email,
            password: hashedPassword,
            role: role || 'MEMBER'
        });

        const token = generateToken(user);

                // Setting cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: 'User registered successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token : token
        });

    }catch(error){
        console.log("Error: "+error);
        
    }

}

// POST /api/auth/login

const loginUser = async (req, res) => {

    try{

        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide email and password' 
            });
        }

                const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

         // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        const token = generateToken(user);

         // Setting up cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

         res.status(200).json({
            message: 'Login successful',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token : token
        });


    }catch(error){
        console.log("Error : "+error);
        
    }

}

// GET /api/auth/profile

const getProfile = async(req, res)=>{

    try {

        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            data: user
        });

    }catch(error){
        console.log("Error : "+error);
        
    }

}


// GET /api/auth/logout
const logoutUser = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            message: 'Logout successful'
        });
    } catch (error) {

        console.log("Error: "+error);
        
    }
};

module.exports = {registerUser, loginUser, logoutUser, getProfile};