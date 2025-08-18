const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Workspace = sequelize.define('Workspace', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: DataTypes.STRING(100), allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    price_per_hour: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
    tableName: 'workspaces',
    timestamps: false
});

module.exports = Workspace;


