module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        productName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        prizePoint: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    });

    Product.associate = (models) => {
        Product.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };


    return Product;
}
