const { DataTypes } = require('sequelize');
const db = require('../database/db.js');
const PatientModel = require('./PatientModel');
const RoomModel = require('./RoomModel');

const QueueModel = db.define("queues", {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    PatientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PatientModel,
            key: 'ID'
        }
    },
    RoomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RoomModel,
            key: 'ID'
        },
    },
    PriorityNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
}}, {
    tableName: 'queues',
    timestamps: false
});

module.exports = QueueModel;
