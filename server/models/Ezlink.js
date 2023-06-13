module.exports = (sequelize, DataTypes) => {
    const Ezlink = sequelize.define("Ezlink", {
    EzlinkCardNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userID: {
    type: DataTypes.STRING,
    allowNull: false
    }
    });
    return Ezlink;
    }