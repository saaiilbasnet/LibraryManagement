const db = require('../database/connection');
const Book = db.books;
const { Op } = require('sequelize');

 // GET /api/book/all

const getBooks = async(req, res)=>{

    const { searchTerm, genre } = req.query;

        // Building where clause 
     const whereClause = {};

     if (searchTerm) {
        whereClause[Op.or] = [
            { title: { [Op.like]: `%${searchTerm}%` } },
            { author: { [Op.like]: `%${searchTerm}%` } }
        ];
    }

    if (genre) {
        whereClause.genre = genre;
    }

    const books = await Book.findAll({
         where: whereClause,
        order: [['createdAt', 'DESC']]
    })

    res.status(200).json({
        message : "Books fetched successfully",
        data : books
    })

}

// POST /api/book/add (Admin only)

const addBook = async(req, res)=>{
    
   try{
     const { title, author, genre, publishedYear, stock } = req.body;

        if (!title || !author || !genre || !publishedYear) {
        return res.status(400).json({
            message: "Please provide title, author, genre and publishedYear"
        });
    }

    const book = await Book.create({
        title : title,
        author : author,
        genre : genre,
        publishedYear : publishedYear,
        stock: stock || 0
    });

    res.status(201).json({
        message: "Book added successfully",
        data: book
    });
   }catch(error){
        console.log("Error : "+error);
        
   }

}

// PUT /api/book/update/:bookId (Admin only)

const updateBook = async (req, res) => {
    try {
        const { title, author, genre, publishedYear, stock } = req.body;
          const bookId = req.params.id;

        // console.log("Book ID : "+bookId);
        

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        // Update book
        await book.update({
            title: title,
            author: author,
            genre : genre,
            publishedYear : publishedYear,
            stock : stock
        });

        res.status(200).json({
            message: "Book updated successfully",
            data: book
        });

    } catch (error) {
        console.log("Error :", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE /api/book/delete/:bookId   (Admin only)


const deleteBook = async(req, res)=>{

     const bookId  = req.params.id;
    const book = await Book.findByPk(bookId);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    await book.destroy();

    res.status(200).json({
        message: "Book deleted successfully"
    });

}

module.exports = {deleteBook, updateBook, addBook, getBooks};
