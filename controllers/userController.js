const {User, Order, Prescription} = require("../models");
const {CreationError, AuthenticationError, ValidationError, ServerError} = require("../models/system/errors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require("../utils/error");

class UserResponse {
    constructor(user, error = new AppError(), message = '', success = false, token = '') {
        this.user = user;
        this.error = error;
        this.message = message;
        this.success = success;
        this.token = token;
    }

    toJSON() {
        return {
            user: this.user,
            error: this.error?.getError(),
            message: this.message,
            success: this.success,
            token: this.token,
        };
    }

    toString() {
        return JSON.stringify(this.toJSON(), null, 2);
    }
}

exports.registerUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(400).json(new UserResponse(null, new ValidationError(), 'Enter username and password').toJSON());
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({...req.body, password: hashedPassword});
        // hide password
        newUser.password ? delete newUser.dataValues.password : null;
        res.status(201).json(new UserResponse(newUser, null, 'User created successfully', true).toJSON());
    } catch (error) {
        res.status(500).json(new UserResponse(null, new CreationError(error), 'Failed to create user').toJSON());
    }
};

exports.loginUser = async (req, res) => {

    try {
        const {username, password} = req.body;
        if (!username || !password) {
            return res.status(401).json(new AuthenticationError('Invalid username or password').toJSON());
        }

        const user = await User.findOne({where: {username: req.body.username}});
        if (!user) {
            return res.status(401).json(new AuthenticationError('Invalid username or password').toJSON());
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json(new AuthenticationError('Invalid username or password').toJSON());
        }

        const payload = {
            id: user.user_id,
        };

        const options = {
            expiresIn: '1d',
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        res.status(200).json(new UserResponse(user, null, 'Login successful', true, token).toJSON());

    } catch (error) {
        res.status(500).json(new UserResponse(null, new ServerError(error), 'Failed to login').toJSON());
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(new UserResponse(users, null, 'Users fetched successfully', true).toJSON());
    } catch (error) {
        res.status(500).json(new UserResponse(null, new ServerError(error), 'Failed to fetch users').toJSON());
    }
};

exports.getUser = async (req, res) => {
    // example: /api/v1/users/1
    try {
        const user = await User
            .findByPk(req.params.id, {
                attributes: {exclude: ['password']},
                include: [
                    {model: Order, as: 'orders'},
                    {model: Prescription, as: 'prescriptions'},
                ],
            });
        if (!user) {
            return res.status(404).json(new UserResponse(null, new ServerError(), 'User not found').toJSON());
        }
        res.status(200).json(new UserResponse(user, null, 'User fetched successfully', true).toJSON());
    } catch (error) {
        res.status(500).json(new UserResponse(null, new ServerError(error), 'Failed to fetch user').toJSON());
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json(new UserResponse(null, new ServerError(), 'User not found').toJSON());
        }
        await user.update(req.body);
        res.status(200).json(new UserResponse(user, null, 'User updated successfully', true).toJSON());
    } catch (error) {
        res.status(500).json(new UserResponse(null, new ServerError(error), 'Failed to update user').toJSON());
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json(new UserResponse(null, new ServerError(), 'User not found').toJSON());
        }
        await user.destroy();
        res.status(200).json(new UserResponse(user, null, 'User deleted successfully', true).toJSON());
    } catch (error) {
        res.status(500).json(new UserResponse(null, new ServerError(error), 'Failed to delete user').toJSON());
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json(new UserResponse(null, new ServerError(), 'User profile not found').toJSON());
        }
        if (user.password) delete user.dataValues.password;
        res.status(200).json(new UserResponse(user, null, 'User profile fetched successfully', true).toJSON());
    } catch (error) {
        res.status(500).json(new UserResponse(null, new ServerError(error), 'Failed to fetch user profile').toJSON());
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json(new UserResponse(null, new ServerError(), 'User profile not found').toJSON());
        }
        await user.update(req.body);
        if (user.password) delete user.dataValues.password;
        res.status(200).json(new UserResponse(user, null, 'User profile updated successfully', true).toJSON());
    } catch (error) {
        res.status(500).json(new UserResponse(null, new ServerError(error), 'Failed to update user profile').toJSON());
    }
}
