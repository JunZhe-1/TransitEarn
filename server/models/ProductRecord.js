module.exports = (sequelize, DataTypes) => {
    const ProductRecord = sequelize.define("ProductRecord", {
        
     
        userphone: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productCat: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        usedpoint: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        redeemdate: {
            type: DataTypes.DATE,
            allowNull: false
          },
          Status: {
            type: DataTypes.STRING,
            allowNull: false
        }
       


        
    });

    ProductRecord.associate = (models) =>{
        ProductRecord.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return ProductRecord;
}