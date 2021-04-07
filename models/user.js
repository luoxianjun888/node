'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Posts,{
                foreignKey:'userid',
            })
        }
    };
    User.init({
        uname: DataTypes.STRING,
        password: DataTypes.STRING(32),
        aname: DataTypes.STRING,
        isadmin: DataTypes.BOOLEAN,
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'user',
        timestamps:false
    });
    return User;
};
