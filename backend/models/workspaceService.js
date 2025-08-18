const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const WorkspaceService = sequelize.define('WorkspaceService', {
    workspace_id: { type: DataTypes.INTEGER, primaryKey: true },
    service_id: { type: DataTypes.INTEGER, primaryKey: true }
}, {
    tableName: 'workspace_services',
    timestamps: false
});

module.exports = WorkspaceService;
