import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your backend URL

const apiService = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const seedDatabase = () => apiService.post('/seed');
export const listTransactions = (month, search, page, perPage) =>
  apiService.get(`/api/transactions?month=${month}&search=${search}&page=${page}&perPage=${perPage}`);
export const getStatistics = (month) => apiService.get(`/statistics?month=${month}`);
export const getBarChartData = (month) => apiService.get(`/bar-chart?month=${month}`);
export const getPieChartData = (month) => apiService.get(`/pie-chart?month=${month}`);
export const getCombinedData = (month) => apiService.get(`/combined-data?month=${month}`);
