export const handleApiResponse = (response: any) => {
    const { statusCode, data, message, error } = response;

    console.log('Response Data:', { statusCode, message, data, success: statusCode === 200 || statusCode === 201 });

    switch (statusCode) {
        case 200:
            return { success: true, message: message || 'Request successful', data };
        case 201:
            return { success: true, message: message || 'Resource created successfully' };
        case 400:
            return { success: false, message: message || 'Bad request: ' + error, statusCode };
        case 404:
            return { success: false, message: message || 'Resource not found', statusCode };
        case 500:
            return { success: false, message: message || 'Internal server error', statusCode };
        default:
            return { success: false, message: 'An unexpected error occurred' };
    }
};