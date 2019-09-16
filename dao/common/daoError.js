'use strict';

class DaoError {
    constructor(errorCode, message) {
        this.errorCode = errorCode;
        this.message = message;
    }
}

// dao error list:
exports.internalServerError = new DaoError(20, 'Internal server error');
exports.notFound = new DaoError(21, 'Entity not found');
exports.invalidArguments = new DaoError(11, 'Invalid arguments');
exports.noChanges = new DaoError(22, 'no record changes');
