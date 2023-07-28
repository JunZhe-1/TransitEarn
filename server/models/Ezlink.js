module.exports = (sequelize, DataTypes) => {
    const Ezlink = sequelize.define("Ezlink", {
    CAN: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance:{
        type: DataTypes.DOUBLE,
        allowNull: true,
        
<<<<<<< Updated upstream
=======
    },
    topupamount:{
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    
    service: 
    {
        type: DataTypes.STRING,
        allowNull: true,
>>>>>>> Stashed changes
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