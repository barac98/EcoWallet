export const config = {
    // API URL: Uses environment variable or defaults to local backend
    // Note: Client-side env variables in Vite must start with VITE_
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
};