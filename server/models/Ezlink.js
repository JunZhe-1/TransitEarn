module.exports = (sequelize, DataTypes) => {
    const Ezlink = sequelize.define("Ezlink", {
    CAN: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance:{
        type: DataTypes.DOUBLE,
        allowNull: true,
        
    }

    },
    );

    Ezlink.associate = (models) => {
        Ezlink.belongsTo(models.Topupinfo, {
            foreignKey: "cardNo",
            as: 'bankcard'
        });
    };

    Ezlink.associate = (models) => {
        Ezlink.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Ezlink;
    }