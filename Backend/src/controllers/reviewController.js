const db = require('../database/connection');
const Review = db.reviews;
const Book = db.books;
const User = db.users;

// GET /api/review/book/:bookId

const getReviews = async(req, res)=>{

    try {

        const bookId  = req.params.bookId;

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const reviews = await Review.findAll({
            where: { bookId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            message: "Reviews fetched successfully",
            data: reviews
        });

    }catch(error){
        console.log("Error : "+error);
        
    }

}

// POST /api/review/add  

const addReview = async (req, res)=>{
    try{

        const { bookId, rating, comment } = req.body;
        const userId = req.user.id;

            if (!bookId || !rating) {
            return res.status(400).json({
                 message: "bookId and rating are required" 
                });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                 message: "Rating must be between 1 and 5" 
                });
        }

         const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({
                 message: "Book not found!" 
                });
        }

                const review = await Review.create({
            userId : userId,
            bookId : bookId,
            rating : rating,
            comment : comment
        });

        res.status(201).json({
            message: "Review added successfully",
            data: review
        });

    }catch(error){
        console.log("Error :"+error);
        
    }
}

// DELETE /api/review/delete/:reviewId

const deleteReview = async (req, res)=>{

    try{

         const reviewId = req.params.reviewId;
        const userId = req.user.id;
        const userRole = req.user.role;

          const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ 
                message: "Review not found!" 
            });
        }

         if (review.userId !== userId && userRole !== 'ADMIN') {
            return res.status(403).json({ message: "Access denied" });
        }

          await Review.destroy({ 
            where: {
                 id: reviewId 
                } 
            });

            res.status(200).json({
                 message: "Review deleted successfully" 
                });

    }catch(error){
        console.log("Error : "+error);
        
    }

}

module.exports = {deleteReview, addReview, getReviews}