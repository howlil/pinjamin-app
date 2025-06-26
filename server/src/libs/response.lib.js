const ResponseHelper = {
    // Success response
    success(res, message, data = null, statusCode = 200) {
        const response = {
            status: 'success',
            message: message
        };

        if (data !== null) {
            response.data = data;
        }

        return res.status(statusCode).json(response);
    },

    // Success response with pagination
    successWithPagination(res, message = 'Success', data = [], pagination = {}, statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data,
            pagination
        });
    },

    // Error response
    error(res, message, statusCode = 500, errors = null) {
        const response = {
            status: 'error',
            message: message
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(statusCode).json(response);
    },

    // Validation error response
    validationError(res, message, errors = null) {
        const response = {
            status: 'error',
            message: message || 'Validation failed'
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(400).json(response);
    },

    // Bad request response
    badRequest(res, message = 'Bad request') {
        return res.status(400).json({
            status: 'error',
            message: message
        });
    },

    // Unauthorized response
    unauthorized(res, message = 'Unauthorized access') {
        return res.status(401).json({
            status: 'error',
            message: message
        });
    },

    // Forbidden response
    forbidden(res, message = 'Forbidden access') {
        return res.status(403).json({
            status: 'error',
            message: message
        });
    },

    // Not found response
    notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            status: 'error',
            message: message
        });
    },

    // Conflict response
    conflict(res, message = 'Resource conflict') {
        return res.status(409).json({
            status: 'error',
            message: message
        });
    },

    // Unprocessable entity response
    unprocessableEntity(res, message = 'Unprocessable entity', errors = null) {
        const response = {
            status: 'error',
            message: message
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(422).json(response);
    },

    // Too many requests response
    tooManyRequests(res, message = 'Too many requests') {
        return res.status(429).json({
            status: 'error',
            message: message
        });
    },

    // Internal server error response
    internalServerError(res, message = 'Internal server error') {
        return res.status(500).json({
            status: 'error',
            message: message
        });
    },

    // Created response
    created(res, message, data = null) {
        return this.success(res, message, data, 201);
    },

    // No content response
    noContent(res) {
        return res.status(204).send();
    },

    // Paginated response
    paginated(res, message, data, pagination) {
        return res.status(200).json({
            status: 'success',
            message: message,
            data: data,
            pagination: pagination
        });
    },

    // Custom response with any status code
    custom(res, statusCode, status, message, data = null, meta = null) {
        const response = {
            status: status,
            message: message
        };

        if (data !== null) {
            response.data = data;
        }

        if (meta !== null) {
            response.meta = meta;
        }

        return res.status(statusCode).json(response);
    },

    // Create pagination object
    createPagination(totalItems, currentPage, itemsPerPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return {
            totalItems,
            totalPages,
            currentPage: parseInt(currentPage),
            itemsPerPage: parseInt(itemsPerPage)
        };
    }
};

module.exports = ResponseHelper; 