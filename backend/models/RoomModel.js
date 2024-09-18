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
    // RoomNumber: {
    //     type:DataTypes.INTEGER,
    //     allowNull: false
    // },
    Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'Rooms',
    timestamps: false
});

module.exports = RoomModel;
