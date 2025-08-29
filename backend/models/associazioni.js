const User = require('./user');
const Location = require('./location');
const Booking = require('./booking');
const Payment = require('./payment');

module.exports = () => {
    // Location → Manager
    Location.belongsTo(User, { as: 'manager', foreignKey: 'manager_id',onDelete: 'CASCADE'  });
    User.hasMany(Location, { as: 'managedLocations', foreignKey: 'manager_id' ,onDelete: 'CASCADE' });

    // Booking → User & Location
    Booking.belongsTo(User, { foreignKey: 'user_id',onDelete: 'CASCADE'  });
    User.hasMany(Booking, { foreignKey: 'user_id', onDelete: 'CASCADE'  });

    Booking.belongsTo(Location, { foreignKey: 'location_id',onDelete: 'CASCADE'  });
    Location.hasMany(Booking, { foreignKey: 'location_id',onDelete: 'CASCADE'  });

    // Payment → Booking
    Payment.belongsTo(Booking, {foreignKey: 'booking_id', onDelete: 'CASCADE' });

    Booking.hasOne(Payment, { foreignKey: 'booking_id', onDelete: 'CASCADE'});

};


