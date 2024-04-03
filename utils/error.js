class AppError extends Error {
    constructor(message = 'App error', code = 500) {
        super();
        this.message = message;
        this.code = code;
    }

    getStatusCode() {
        return this.code;
    }

    getMessage() {
        return this.message;
    }

    getError() {
        return {
            message: this.message.toString(),
            code: this.code,
        };
    }

    toString() {
        return `${this.code}: ${this.message}`;
    }

    toJSON() {
        return {
            message: this.message,
            code: this.code,
        };
    }
}

module.exports = AppError;