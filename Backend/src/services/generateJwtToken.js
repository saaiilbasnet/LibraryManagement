const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || process.env.JWT_EXPIRY }
    );
}

module.exports = generateToken;