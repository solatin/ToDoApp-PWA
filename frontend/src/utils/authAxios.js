import axios from 'axios';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from '../constants/authConstants';
import store from '../store/configureStore';
import {logoutRequest} from '../actions/authActions';

const config = {
  baseURL: process.env.REACT_APP_SERVER_URL || '/',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
};

const authAxios = axios.create(config);

let refreshTokenRequesting = null;

const storeToken = (jwtAccessToken, jwtRefreshToken) => {
  localStorage.setItem(JWT_ACCESS_TOKEN, jwtAccessToken);
  localStorage.setItem(JWT_REFRESH_TOKEN, jwtRefreshToken);
};

const destroyToken = () => {
  localStorage.removeItem(JWT_ACCESS_TOKEN);
  localStorage.removeItem(JWT_REFRESH_TOKEN);
};

const refreshToken = async () => {
  const res = await authAxios.post('account/refresh-token',{
    accessToken : localStorage.getItem(JWT_ACCESS_TOKEN),
    refreshToken: localStorage.getItem(JWT_REFRESH_TOKEN)
  });
  storeToken(res.access_token, res.refresh_token);
}

authAxios.interceptors.request.use(
  (req) => {
    req.headers.Authorization = `Bearer ${localStorage.getItem(JWT_ACCESS_TOKEN)}`;
    return req;
  },
  (err) => Promise.reject(err)
);

authAxios.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const {status, data, config} = err.response;
    const {message} = data;

    if(status === 401 && message === 'jwt expired') {
      if(!refreshTokenRequesting){
        refreshTokenRequesting = refreshToken();
      }
      await refreshTokenRequesting;
      refreshTokenRequesting = null;
      config.headers.Authorization = `Bearer ${localStorage.getItem(JWT_ACCESS_TOKEN)}`;
      return authAxios.request(config);
    }

    if(status === 401 && message === 'error refresh'){
      refreshTokenRequesting = null;
      destroyToken();
      store.dispatch(logoutRequest());
    }

    return Promise.reject(err.response.data);
  }
);

export default authAxios;
