// models/location.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Location = sequelize.define('Location', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING(50), // prima era ENUM
        allowNull: false,
        defaultValue: 'ufficio privato'
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    services: {
        type: DataTypes.TEXT, // prima era ENUM
        allowNull: true
    },
    price_per_hour: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    image_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    },
    {
    tableName: 'locations',
    timestamps: false

});

module.exports = Location;
