const router = require('express').Router()
const {addBorrowRequest, getAllBorrow, returnBorrow} = require('../controllers/borrowController')
const {authMiddleware, roleMiddleware} = require('../middlewares/authMiddleware')

router.get('/all', authMiddleware, roleMiddleware('ADMIN'), getAllBorrow);
router.post('/request',authMiddleware, roleMiddleware('MEMBER'),addBorrowRequest);
router.put('/return/:id',authMiddleware, returnBorrow);


module.exports = router