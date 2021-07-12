const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        // User Model attributes are defined here
        message: {
            type: DataTypes.TEXT, 
            allowNull: false,
        },
        link_message: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        }
      });
    // Sequelize association to create a connection between User model & Post model
      Post.associate = function(models) {
        // associations can be defined here
        models.Post.belongsTo(models.User);
        models.Post.hasMany(models.Comment);
      };

      return Post
    };
