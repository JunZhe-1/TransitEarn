module.exports = (sequelize, DataTypes) => {
    const PointRecord = sequelize.define("PointRecord", {
        
        senderName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sender: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recipientName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        recipient: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transferpoint: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

        
    });

    PointRecord.associate = (models) =>{
        PointRecord.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return PointRecord;
}