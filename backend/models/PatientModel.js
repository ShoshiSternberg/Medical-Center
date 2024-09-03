const { DataTypes } = require('sequelize');
const db = require('../database/db.js');
const HMOModel = require('./HMOModel.js'); 

const PatientModel = db.define("patients", {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    Phone: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    HMOid: {
        type: DataTypes.INTEGER,
        allowNull: false, 
        references: {
            model: HMOModel,
            key: 'ID'
        }
    },
    CheckIn: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    CheckOut: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    UniqueNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    Tz: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'patients',
    timestamps: false
});

module.exports = PatientModel;
