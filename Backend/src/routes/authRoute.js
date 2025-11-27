
const {getProfile,logoutUser,registerUser,loginUser} = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getProfile);
router.get('/logout', authMiddleware, logoutUser);

module.exports = router
