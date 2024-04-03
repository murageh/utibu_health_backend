const jwt = require('jsonwebtoken');
const {User} = require("../models");
const {AuthorizationError} = require("../models/system/errors");

exports.authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json(new AuthorizationError('No token provided').toJSON());
    }

    console.log({token});

    try {
        const decoded = jwt.verify(token.split(' ')[1],
            process.env.JWT_SECRET);
        console.log({decoded});
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json(new AuthorizationError('Invalid token').toJSON());
        }
        req.user = user;
        console.log('req body: ', req.body);
        next();
    } catch (error) {
        console.log({error});
        return res.status(401).json(new AuthorizationError('Invalid token').toJSON());
    }
}