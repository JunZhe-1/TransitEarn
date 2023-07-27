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
        },
        transferpointdate: {
            type: DataTypes.DATE,
            allowNull: false
          },
          Status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Redeemed: {
            type: DataTypes.STRING,
            allowNull: true
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