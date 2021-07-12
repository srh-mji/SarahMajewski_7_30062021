const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // User Model attributes are defined here
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
      });
    // Sequelize association to create a connection between User model & Post model
      User.associate = function(models) {
        // associations can be defined here
        models.User.hasMany(models.Post)
      };

      return User
    };