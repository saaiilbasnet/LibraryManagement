const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_CONNECTION);

// Authenticate DB connection

sequelize.authenticate()
  .then(() => {
    console.log("Successfully connected to Supabase!");
  })
  .catch((error) => {
    console.log("Error: " + error);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models

db.users = require('./models/userModel')(sequelize, DataTypes);
db.books = require('./models/bookModel')(sequelize, DataTypes);
db.borrows = require('./models/borrowModel')(sequelize, DataTypes);
db.reviews = require('./models/reviewModel')(sequelize, DataTypes);

// for borrow

db.borrows.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.users.hasMany(db.borrows, {
  foreignKey: "userId",
  as: "borrows",
});


db.borrows.belongsTo(db.books, {
  foreignKey: "bookId",
  as: "book",
});

db.books.hasMany(db.borrows, {
  foreignKey: "bookId",
  as: "borrows",
});

// for reviews

db.reviews.belongsTo(db.users, {
   foreignKey: "userId",
    as: "user" 
  });

db.users.hasMany(db.reviews, {
   foreignKey: "userId", 
   as: "reviews" 
  });

db.reviews.belongsTo(db.books, { 
  foreignKey: "bookId", 
  as: "book" 
});

db.books.hasMany(db.reviews, 
  { foreignKey: "bookId",
     as: "reviews" 
    });


// Sync to Supabase
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Migrated to supabase");
  })
  .catch((error) => {
    console.log("Error : " + error);
  });

module.exports = db;
