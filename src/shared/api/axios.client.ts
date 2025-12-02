import axios from 'axios';

import { getTokenFromStorage } from '../lib';

const API_URL = import.meta.env.VITE_API_URL;

const $api = axios.create({
  baseURL: API_URL
  // withCredentials: true
});

$api.interceptors.request.use(config => {
  const token = getTokenFromStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

$api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token is invalid or expired on server side
      // The auth store will be checked by router on next navigation
      // Or we can dispatch a custom event
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default $api;
