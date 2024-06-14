const { DataTypes } = require('sequelize');
const db = require('../database/db.js');

const HMOs = db.define('HMOs', {
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
    tableName: 'HMOs',
    timestamps: false
});

module.exports = HMOs;
