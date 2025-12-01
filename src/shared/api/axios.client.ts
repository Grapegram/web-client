import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const $api = axios.create({
  baseURL: API_URL
  // withCredentials: true
});

// Helper function to get token from localStorage
function getTokenFromStorage(): string | null {
  try {
    const userStoreData = localStorage.getItem('user');
    if (!userStoreData) return null;

    const parsedData = JSON.parse(userStoreData);
    return parsedData.token || null;
  } catch (error) {
    console.error('Failed to get token from localStorage:', error);
    return null;
  }
}

$api.interceptors.request.use(config => {
  const token = getTokenFromStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default $api;
