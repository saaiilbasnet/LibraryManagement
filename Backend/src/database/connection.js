
const {Sequelize, DataTypes} = require('sequelize');
// const CTN_STRING = process.env.DB_CONNECTION;

const sequelize = new Sequelize(process.env.DB_CONNECTION);

// authenticating connection

sequelize.authenticate()
.then(()=>{
    console.log("Successfully connected to Supabase!");
    
})
.catch((error)=>{
  console.log("Error: "+error);
  
})

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./models/userModel')(sequelize,DataTypes);
db.books = require('./models/bookModel')(sequelize,DataTypes);
// db.borrows = require('./models/borrowModel')(sequelize,DataTypes);
// db.reviews = require('./models/reviewModel')(sequelize,DataTypes);

// migration into supabase

sequelize.sync({alter:true})
.then(()=>{
    console.log("Migrated to supabase");
    
})
.catch((error)=>{
    console.log("Error : "+error);
    
})

module.exports = db;