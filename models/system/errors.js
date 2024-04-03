const AppError = require("../../utils/error");


class CreationError extends AppError {
    constructor(message) {
        super(message);
        this.name = 'CreationError';
        this.code = 400;
    }
}

class AuthenticationError extends AppError {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
        this.code = 401;
    }
}

class AuthorizationError extends AppError {
    constructor(message) {
        super(message);
        this.name = 'AuthorizationError';
        this.code = 401;
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.code = 400;
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.code = 404;
    }
}

class ServerError extends AppError {
    constructor(message) {
        super(message);
        this.name = 'ServerError';
        this.code = 500;
    }
}

module.exports = {AuthenticationError, AuthorizationError, CreationError, ValidationError, NotFoundError, ServerError};