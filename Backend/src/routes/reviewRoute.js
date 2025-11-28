const {addReview, deleteReview, getReviews} = require('../controllers/reviewController');
const {authMiddleware, roleMiddleware} = require('../middlewares/authMiddleware');
const router = require('express').Router();

router.get('/book/:bookId',authMiddleware,getReviews);
router.post('/add',authMiddleware, roleMiddleware('MEMBER'),addReview);
router.delete('/delete/:reviewId',authMiddleware,deleteReview);


module.exports = router