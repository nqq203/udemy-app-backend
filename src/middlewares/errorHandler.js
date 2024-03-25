const { ErrorResponse } = require('../common/error.response'); // Custom error response class
const pick = require('../utils/pick'); // Utility function to pick specific properties from an object

module.exports = (error, req, res, next) => {
    // Log the error details using logger, including specific request information
    __logger.error(error.message, {
        ...pick(req, ['ip', 'originalUrl', 'method', 'params', 'body']), // Select specific request properties
        status: error.status || 500, // Log error status or default to 500
    });

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
