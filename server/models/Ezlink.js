module.exports = (sequelize, DataTypes) => {
    const Ezlink = sequelize.define("Ezlink", {
    CAN: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey:true,

    },


    },
{primaryKey:'CAN'}
    );

    Ezlink.associate = (models) => {
        Ezlink.belongsTo(models.Topupinfo, {
            foreignKey: "cardNo",
            as: 'bankcard'
        });
    };

    return Ezlink;
    }
