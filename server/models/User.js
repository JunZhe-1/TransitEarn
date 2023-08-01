module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          phone: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          point: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          address: {
            type: DataTypes.STRING,
            allowNull: false,
          },
    });

    User.associate = (models) => {
        User.hasMany(models.Ezlink, {
            foreignKey: "userId",
            onDelete: "cascade"
        });
    };

    User.associate = (models) => {
        User.hasMany(models.PointRecord, {
          foreignKey: "userId",
          onDelete: "cascade"
        });
      };
      User.associate = (models) => {
        User.hasMany(models.ProductRecord, {
          foreignKey: "userId",
          onDelete: "cascade"
        });
      };
    

    return User;
}
