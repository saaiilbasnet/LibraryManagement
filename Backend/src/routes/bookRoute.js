const {getBooks, addBook, updateBook, deleteBook} = require('../controllers/bookController')
const router = require('express').Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// admin routes only
router.post('/add', authMiddleware, roleMiddleware('ADMIN'), addBook);
router.put('/update/:id', authMiddleware, roleMiddleware('ADMIN'), updateBook);
router.delete('/delete/:id', authMiddleware, roleMiddleware('ADMIN'), deleteBook);
router.get('/all',authMiddleware,getBooks);

module.exports = router
