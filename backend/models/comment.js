const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        // User Model attributes are defined here
        message: {
            type: DataTypes.TEXT, 
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        }
      });
    // Sequelize association to create a connection between User model & Post model
      Comment.associate = function(models) {
        // associations can be defined here
        models.Post.belongsTo(models.User);
        models.Post.belongsTo(models.Post);
      };

      return Comment
    };