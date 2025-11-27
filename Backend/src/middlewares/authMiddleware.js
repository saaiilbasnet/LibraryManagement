const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const User = db.users;

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({
            message: "Please provide token!"
        });
    }

    // verify token
    
    jwt.verify(token, process.env.JWT_SECRET || "thisIsSecret", async (error, decoded)=>{
        if (error) {
            return res.status(403).json({
                message: "Token Invalid"
            });
        }

        // find user
        const userData = await User.findByPk(decoded.id, {
            attributes: ["id", "name", "email", "role"]
        });

        if (!userData) {
            return res.status(403).json({
                message: "No user matched!"
            });
        }

        req.user = userData;
        next();
    });
};

const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required!"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied!"
            });
        }

        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };