
const bookModel = (sequelize, DataTypes)=>{

    const Book = sequelize.define("book",{
          id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
        title : {
            type : DataTypes.STRING,
            allowNull : false
        },
        author : {
            type : DataTypes.STRING,
            allowNull : false
        },
        genre : {
            type : DataTypes.STRING,
            allowNull : false
        },
        publishedYear : {
            type : DataTypes.INTEGER,
            allowNull: false
        },
                stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
    })

    return Book

}

module.exports = bookModel