const User = require('./user');
const Location = require('./location');
const Booking = require('./booking');
const Payment = require('./payment');

module.exports = () => {
    // Location → Manager
    Location.belongsTo(User, { as: 'manager', foreignKey: 'manager_id' });
    User.hasMany(Location, { as: 'managedLocations', foreignKey: 'manager_id' });

    // Booking → User & Location
    Booking.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Booking, { foreignKey: 'user_id' });

    Booking.belongsTo(Location, { foreignKey: 'location_id' });
    Location.hasMany(Booking, { foreignKey: 'location_id' });

    // Payment → Booking
    Payment.belongsTo(Booking, {foreignKey: 'booking_id', onDelete: 'CASCADE',  // <-- aggiungi
    });

    Booking.hasOne(Payment, { foreignKey: 'booking_id', onDelete: 'CASCADE',  // <-- aggiungi
    });

};


