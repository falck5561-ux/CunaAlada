export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Esta sirve para las fotos (le quita el "/api")
export const BASE_URL = API_URL.replace('/api', '');