const { DataTypes } = require('sequelize');
const db = require('../database/db.js');

const HMOModel = db.define('HMOs', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'hmos',
    timestamps: false
});

module.exports = HMOModel;
