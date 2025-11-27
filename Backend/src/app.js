const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const authRoute = require('./routes/authRoute');

app.use("/api/auth",authRoute);

// Error handling middleware

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!' 
    });
});

module.exports = app;