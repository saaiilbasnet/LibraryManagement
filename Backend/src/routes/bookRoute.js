const {getBooks, addBook, updateBook, deleteBook} = require('../controllers/bookController')
const router = require('express').Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// admin routes only
router.post('/add', authMiddleware, roleMiddleware('ADMIN'), addBook);
router.put('/update/:bookId', authMiddleware, roleMiddleware('ADMIN'), updateBook);
router.delete('/delete/:bookId', authMiddleware, roleMiddleware('ADMIN'), deleteBook);
router.get('/all',authMiddleware,getBooks);

module.exports = router
