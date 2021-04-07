'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cate extends Model {
        static associate(models) {
            Cate.hasMany(models.Posts,{
                foreignKey:'cateid',
            })
        }
    };
    Cate.init({
        catename: DataTypes.STRING,
        aname: DataTypes.STRING,
        pid: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Cate',
        tableName: 'cate',
        timestamps:false
    });
    return Cate;
};
