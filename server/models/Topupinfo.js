module.exports = (sequelize, DataTypes) => {
    const Topupinfo = sequelize.define("Topupinfo", {
    cardNo: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,

    },
    balance: {
    type: DataTypes.DOUBLE,
    allowNull: false
    },
    cvv:{
        type: DataTypes.STRING,
        allowNull : false
    },

    },

{primaryKey: 'cardNo'}

    );



    Topupinfo.associate = (models) => {
        Topupinfo.hasMany(models.Ezlink, {
            foreignKey: "cardNo",
            onDelete: "cascade"
        });
    };

    return Topupinfo;
    }