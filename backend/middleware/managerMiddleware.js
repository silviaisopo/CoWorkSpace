//controllo già fatto in authMiddleware.js
/*const jwt = require('jsonwebtoken');

// This middleware assumes the general auth middleware has already run
const managerMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'manager') {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Not a manager.' });
    }
};

module.exports = managerMiddleware;*/
