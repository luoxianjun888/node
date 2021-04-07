'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.Posts)
        }
    };
    Comment.init({
        uname: DataTypes.STRING,
        content: DataTypes.STRING,
        love: DataTypes.INTEGER,
        state:DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'comment',
    });
    return Comment;
};
