const { DataTypes } = require('sequelize');
const db = require('../database/db.js');

const MessagesModel = db.define("messages", {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Message: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false 
    },
}, {
    tableName: 'messages',
    timestamps: false
});

module.exports = MessagesModel;


