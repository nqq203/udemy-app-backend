// Import necessary modules and set environment variable
const chalk = require('chalk'); // For colored console output
const { ErrorResponse } = require('../common/error.response'); // Custom error response class
const pick = require('../utils/pick'); // Utility function to pick specific properties from an object

module.exports = (error, req, res, next) => {
    // Log the error details using logger, including specific request information
    __logger.error(error.message, {
        ...pick(req, ['ip', 'originalUrl', 'method', 'params', 'body']), // Select specific request properties
        status: error.status || 500, // Log error status or default to 500
    });

    // If the error is not of custom ErrorResponse type and environment is not 'production'
    if (!(error instanceof ErrorResponse) && process.env.NODE_ENV !== 'production') {
        // Log a system error message to console in red
        console.log(chalk.bgRed('System error!'));

        error = {
            code: 500,
            message: 'Internal Server Error',
            errors: null,
        };
    }

    // Extract error properties
    const code = error.code;
    const message = error.message;
    const errors = error.errors;

    // Send error response to the client
    res.status(code).json({
        status: 'Error',
        message,
        code,
        errors,
    });
};
