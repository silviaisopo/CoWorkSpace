const User = require('./user');
const Location = require('./location');
const Workspace = require('./workspace');
const Service = require('./service');
const WorkspaceService = require('./workspaceService');
const Booking = require('./booking');
const Payment = require('./payment');

module.exports = () => {
    // Location → Manager
    Location.belongsTo(User, { as: 'manager', foreignKey: 'manager_id' });
    User.hasMany(Location, { as: 'managedLocations', foreignKey: 'manager_id' });

    // Workspace → Location
    Workspace.belongsTo(Location, { foreignKey: 'location_id' });
    Location.hasMany(Workspace, { foreignKey: 'location_id' });

    // Many-to-Many: Workspace ↔ Service
    Workspace.belongsToMany(Service, { through: WorkspaceService, foreignKey: 'workspace_id', otherKey: 'service_id' });
    Service.belongsToMany(Workspace, { through: WorkspaceService, foreignKey: 'service_id', otherKey: 'workspace_id' });

    // Booking → User & Workspace
    Booking.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Booking, { foreignKey: 'user_id' });

    Booking.belongsTo(Workspace, { foreignKey: 'workspace_id' });
    Workspace.hasMany(Booking, { foreignKey: 'workspace_id' });

    // Payment → Booking
    Payment.belongsTo(Booking, { foreignKey: 'booking_id' });
    Booking.hasOne(Payment, { foreignKey: 'booking_id' });
};
