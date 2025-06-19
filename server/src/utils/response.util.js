class Response {
    static success(res, data = null, message = 'Success', statusCode = 200, pagination = null) {
        const response = {
            status: 'success',
            message,
            ...(data && { data }),
            ...(pagination && { pagination })
        };

        return res.status(statusCode).json(response);
    }

    static successWithPagination(res, data, pagination, message = 'Success', statusCode = 200) {
        const response = {
            status: 'success',
            message,
            data,
            pagination
        };

        return res.status(statusCode).json(response);
    }

    static created(res, data = null, message = 'Created successfully') {
        return this.success(res, data, message, 201);
    }

    static noContent(res, message = 'Operation completed successfully') {
        return res.status(204).json({
            status: 'success',
            message
        });
    }

    static accepted(res, data = null, message = 'Accepted') {
        return this.success(res, data, message, 202);
    }

    static error(res, message = 'Error occurred', statusCode = 500, errors = null) {
        const response = {
            status: 'error',
            message,
            ...(errors && { errors })
        };

        return res.status(statusCode).json(response);
    }
}

module.exports = Response; 