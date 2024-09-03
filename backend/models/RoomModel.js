const { DataTypes } = require('sequelize');
const db = require('../database/db.js');

const RoomModel = db.define("rooms", {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'rooms',
    timestamps: false
});

module.exports = RoomModel;
