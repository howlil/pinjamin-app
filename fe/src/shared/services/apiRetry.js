const IS_DEVELOPMENT = import.meta.env.DEV;

export const retryRequest = async (requestFn, maxRetries = 2, delay = 1000) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await requestFn();
            return result;
        } catch (error) {
            lastError = error;

            const shouldRetry = error.response?.status >= 500 ||
                error.code === 'ECONNABORTED' ||
                error.code === 'NETWORK_ERROR';

            if (attempt < maxRetries && shouldRetry) {
                if (IS_DEVELOPMENT) {
                    console.log(`Mencoba ulang permintaan (${attempt + 1}/${maxRetries}) dalam ${delay}ms`);
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
                continue;
            }

            throw error;
        }
    }

    throw lastError;
}; 