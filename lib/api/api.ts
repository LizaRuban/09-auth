import axios from 'axios';
const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

// Створюємо інстанс axios
export const nextServer = axios.create({
  baseURL: baseURL,
  withCredentials: true, // дозволяє axios працювати з cookie
});
