'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Posts extends Model {
        static associate(models) {
            Posts.belongsTo(models.Cate)
            Posts.belongsTo(models.User)
            Posts.hasMany(models.Comment,{foreignKey:'postid'})
        }
    };
    Posts.init({
        title: DataTypes.STRING,
        desc: DataTypes.STRING,
        content: DataTypes.TEXT,
        piclist: DataTypes.JSON,
        pic: DataTypes.STRING,
        dianji:DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Posts',
        tableName: 'posts',
    });
    return Posts;
};
