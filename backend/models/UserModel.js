const { DataTypes } = require('sequelize');
const db = require('../database/db.js');
const RolesModel = require('./RoleModel.js');

const UsersModel = db.define("users", {
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
    RoleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RolesModel,
            key: 'ID'
        }
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = UsersModel;
