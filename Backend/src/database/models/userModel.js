
const userModel = (sequelize, DataTypes)=>{

    const User = sequelize.define("user",{
         id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false
      },
        name : {
            type : DataTypes.STRING,
            allowNull: false
        },
        email : {
            type : DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate : {
                isEmail: true
            }
        },
        password : {
            type : DataTypes.STRING,
            allowNull: false
        },
        role : {
            type : DataTypes.ENUM("ADMIN", "MEMBER"),
            defaultValue : 'MEMBER',
            allowNull : false
        }
    })

    return User;

}

module.exports = userModel