const db = require('../database/connection');
const Borrow = db.borrows;
const Book = db.books;
const User = db.users;

// GET /api/borrow/all   (Admin only)

const getAllBorrow = async (req, res)=>{

    try {

                const borrows = await Borrow.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author', 'genre']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            message: "Borrows fetched successfully",
            data: borrows
        });

    }catch(error){
        console.log("Error : "+error);
        
    }

}

// POST /api/borrow/request (Member only)

const addBorrowRequest = async (req, res)=>{

    try {

        const { bookId } = req.body;
        const userId = req.user.id;

         if (!bookId) {
            return res.status(400).json({
                message: "Please provide bookId"
            });
        }

         // Checking if book exists
        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Checking the no. of stock left
        if (book.stock <= 0) {
            return res.status(400).json({
                message: "Book is not available for borrowing"
            });
        }

        const borrow = await Borrow.create({
            userId: userId,
            bookId: bookId,
            borrowDate: new Date(),
            status: 'BORROWED'
        });

        // book stock get decreased as the borrow is done by user
        await Book.update({
            stock: book.stock - 1
        }, {
            where: {
                id: bookId
            }
        });

                res.status(201).json({
            message: "Book borrowed successfully",
            data: borrow
        });


    }catch(error){

        console.log("Error : "+error);
        

    }

}

// PUT /api/borrow/return/:borrowId (Member or Admin)

const returnBorrow = async (req, res)=>{

    try {

        const borrowId = req.params.id;
        const { returnDate } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

         const borrow = await Borrow.findByPk(borrowId);

         if (!borrow) {
            return res.status(404).json({
                message: "Borrow record not found"
            });
        }

        if (borrow.status === 'RETURNED') {
            return res.status(400).json({
                message: "Book has already been returned"
            });
        }

         if (userRole !== 'ADMIN' && borrow.userId !== userId) {
            return res.status(403).json({
                message: "You can only return your own borrowed books"
            });
        }

         await Borrow.update({
            returnDate: returnDate || new Date(),
            status: 'RETURNED'
        }, {
            where: {
                id: borrowId
            }
        });

         const book = await Book.findByPk(borrow.bookId);
        await Book.update({
            stock: book.stock + 1 
        }, {
            where: {
                id: borrow.bookId
            }
        });

                const updatedBorrow = await Borrow.findByPk(borrowId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author', 'genre', 'stock']
                }
            ]
        });

        res.status(200).json({
            message: "Book returned successfully",
            data: updatedBorrow
        });

    }catch(error){
        console.log("Error : "+error);
        
    }

}

module.exports = {returnBorrow, addBorrowRequest, getAllBorrow}