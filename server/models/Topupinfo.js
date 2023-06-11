module.exports = (sequelize, DataTypes) => {
    const Topupinfo = sequelize.define("Topupinfo", {
    cardNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
    type: DataTypes.DOUBLE,
    allowNull: false
    }
    });
    return Topupinfo;
    }