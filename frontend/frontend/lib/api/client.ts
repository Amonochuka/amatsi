import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('supabase_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Farm Management Endpoints
export const farmAPI = {
  getFarms: () => apiClient.get('/farms'),
  getFarmDetails: (farmId: string) => apiClient.get(`/farms/${farmId}`),
};

// Weather Endpoints
export const weatherAPI = {
  getCurrentWeather: (lat: number, lon: number) =>
    apiClient.get(`/weather/current?lat=${lat}&lon=${lon}`),
  getForecast: (lat: number, lon: number) =>
    apiClient.get(`/weather/forecast?lat=${lat}&lon=${lon}`),
};

// Irrigation & Sensor Recommendation Endpoints
export const recommendationAPI = {
  getLatestRecommendation: (farmId: string) =>
    apiClient.get(`/recommendations/latest?farmId=${farmId}`),
  getHistory: (farmId: string) =>
    apiClient.get(`/recommendations/history?farmId=${farmId}`),
};

// Alerts & SMS Communication Endpoints
export const alertAPI = {
  sendSMS: (phone: string, message: string) =>
    apiClient.post('/alerts/sms', { phone, message }),
  getAlerts: (farmId: string) =>
    apiClient.get(`/alerts?farmId=${farmId}`),
};