import {
  CHANGE_TODO_FILTER,
  FETCH_FAILURE,
  FETCH_SUCCESS,
  FETCH_REQUEST,
  CREATE_FAILURE,
  CREATE_SUCCESS,
  CREATE_REQUEST,
  DELETE_FAILURE,
  DELETE_SUCCESS,
  DELETE_REQUEST,
  UPDATE_FAILURE,
  UPDATE_SUCCESS,
  UPDATE_REQUEST,
  CLEAR_COMPLETED_FAILURE,
  CLEAR_COMPLETED_REQUEST,
  CLEAR_COMPLETED_SUCCESS,
  UPDATE_STATUS
} from '../constants/todoConstants';

const initialState = {
  items: [],
  filter: 'all',
  isOnline: true,
  error: null,
  loading: false,
};

const todosReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CHANGE_TODO_FILTER:
      return {
        ...state,
        filter: payload.filter,
      };
    case FETCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        items: payload,
        loading: false,
      };
    case FETCH_FAILURE:
      return {
        ...state,
        items: [],
        error: payload,
      };
    case CREATE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CREATE_FAILURE:
      return {
        ...state,
        error: payload,
      };
    case DELETE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case DELETE_FAILURE:
      return {
        ...state,
        error: payload,
      };
    case UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_FAILURE:
      return {
        ...state,
        error: payload,
      };
    case CLEAR_COMPLETED_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CLEAR_COMPLETED_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case CLEAR_COMPLETED_FAILURE:
      return {
        ...state,
        error: payload,
      };
    case UPDATE_STATUS:
      return {
        ...state,
        isOnline: payload
      }
    default:
      return state;
  }
};

export default todosReducer;
