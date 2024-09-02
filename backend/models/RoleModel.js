const { DataTypes } = require('sequelize');
const db = require('../database/db.js');

const RoleModel = db.define("roles", {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Permission: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Roles',
    timestamps: false
});

module.exports = RoleModel;
