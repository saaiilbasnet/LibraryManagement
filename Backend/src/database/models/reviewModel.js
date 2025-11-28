
const reviewModel = (sequelize, DataTypes)=>{

    const Review = sequelize.define('review',{
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        bookId : {
              type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'books',
                key: 'id'
            }
        },
        comment : {
            type : DataTypes.INTEGER,
              validate: {
                min: 1,
                max: 5
            },
            allowNull : false
        },
        comment : {
            type : DataTypes.TEXT,
            allowNull : true
        }
    })

    return Review;

}

module.exports = reviewModel;