const ResponseHelper = require("../helpers/response.helper");
const logger = require("../utils/winston.util");

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack || err.message);
    return ResponseHelper.error(
        res,
        err.message || "Internal Server Error",
        err.errors || null,
        err.statusCode || 500
    );

};

module.exports = errorHandler;