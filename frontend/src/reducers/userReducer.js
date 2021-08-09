import { LOGIN_FAILURE, LOGIN_SUCCESS, LOGIN_REQUEST, LOGOUT_REQUEST } from '../constants/userConstants';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: payload,
        error: null,
        loading: false,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload
      };
    case LOGOUT_REQUEST:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default userReducer;
