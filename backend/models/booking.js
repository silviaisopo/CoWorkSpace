const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Location = require('./location');
const User = require('./user');

const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: User, key: 'id' }
    },
    location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Location, key: 'id' }
    },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pending' }
}, {
    tableName: 'bookings',
    timestamps: false
});

module.exports = Booking;

