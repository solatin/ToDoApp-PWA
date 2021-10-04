import axios from 'axios';

const config = {
  baseURL: process.env.REACT_APP_SERVER_URL || '/',
  timeout: 3000
};

const axiosClient = axios.create(config);

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);

export default axiosClient;