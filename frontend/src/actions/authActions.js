import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_REQUEST } from "../constants/userConstants"
import axiosClient from "../utils/axios";
import Notification from '../services/Notification';
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "../constants/authConstants";

export const loginRequest = (email, password) => (dispatch) => {
  dispatch({type: LOGIN_REQUEST});
  return axiosClient.post('/account/login', {email, password});
}

export const loginSuccess = (rs) => async (dispatch) => {
  localStorage.setItem(JWT_ACCESS_TOKEN, rs.jwtAccessToken);
  localStorage.setItem(JWT_REFRESH_TOKEN, rs.jwtRefreshToken);
  await Notification.subscribe();
  dispatch({type: LOGIN_SUCCESS, payload: rs.email});
}

export const loginFailure = (e) => ({type: LOGIN_FAILURE, payload: e});

export const logoutRequest = () => async (dispatch) => {
  await Notification.unsubscribe();
  dispatch({type: LOGOUT_REQUEST});

}