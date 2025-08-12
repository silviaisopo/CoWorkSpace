const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_method: { type: DataTypes.STRING(100) },
    status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'completed' },
    transaction_id: { type: DataTypes.STRING(255) }
}, {
    tableName: 'payments',
    timestamps: false
});

module.exports = Payment;
