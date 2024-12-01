const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token)
    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    next();
};

exports.isFarmer = (req, res, next) => {
    if (req.user.role !== 'farmer') {
        return res.status(403).send('Access denied');
    }
    next();
};

exports.isBuyer = (req, res, next) => {
    if (req.user.role !== 'buyer') {
        return res.status(403).send('Access denied');
    }
    next();
};
