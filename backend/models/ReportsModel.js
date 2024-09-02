const { DataTypes } = require('sequelize');
const db = require('../database/db.js');
const HMOModel = require('./HMOModel');

const ReportModel = db.define('reports', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Ensure this is set to true
        allowNull: false
    },
    hmoID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: HMOModel,
            key: 'ID'
        }
    },
    currentDate: {
        type: DataTypes.STRING(255), // Use STRING for 'currentDate' field
        allowNull: false
    },
    amountOfPatients: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'reports',
    timestamps: false
});

module.exports = ReportModel;
