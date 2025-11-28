const borrowModel = (sequelize, DataTypes) => {
    const Borrow = sequelize.define("borrow", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'books',
                key: 'id'
            }
        },
        borrowDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        returnDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("BORROWED", "RETURNED"),
            defaultValue: 'BORROWED',
            allowNull: false
        }
    });

    return Borrow;
};

module.exports = borrowModel;