import {
  CHANGE_TODO_FILTER,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_FAILURE,
  CREATE_FAILURE,
  CREATE_SUCCESS,
  CREATE_REQUEST,
  DELETE_FAILURE,
  DELETE_SUCCESS,
  DELETE_REQUEST,
  UPDATE_FAILURE,
  UPDATE_REQUEST,
  UPDATE_SUCCESS,
  COMPLETE_FAILURE,
  COMPLETE_REQUEST,
  COMPLETE_SUCCESS,
  CLEAR_COMPLETED_FAILURE,
  CLEAR_COMPLETED_REQUEST,
  CLEAR_COMPLETED_SUCCESS,
  UPDATE_STATUS
} from '../constants/todoConstants';
import authAxios from '../utils/authAxios';


export const changeTodoFilterDispatchRequest = (filter) => ({
  type: CHANGE_TODO_FILTER,
  payload: { filter },
});

export const changeTodoFilter = (filter) => (dispatch) => {
  dispatch(changeTodoFilterDispatchRequest(filter));
};

export const fetchSuccess = (todos) => ({ type: FETCH_SUCCESS, payload: todos });

export const fetchFailure = (error) => ({ type: FETCH_FAILURE, payload: error });

export const fetchRequest = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_REQUEST });
    const rs = await authAxios.get('/todos');
    const data = rs.map(todo => ({...todo, completed: !!todo.completed }));
    dispatch(fetchSuccess(data));
  } catch (e) {
    dispatch(fetchFailure(e));
  }
};

export const createSuccess = () => ({ type: CREATE_SUCCESS });

export const createFailure = (error) => ({ type: CREATE_FAILURE, payload: error });

export const createRequest = (content) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_REQUEST });
    await authAxios({
      url: '/todos',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({content}),
    });
    dispatch(createSuccess());
  } catch (e) {
    dispatch(createFailure(e));
  }
};

export const deleteSuccess = () => ({ type: DELETE_SUCCESS });

export const deleteFailure = (error) => ({ type: DELETE_FAILURE, payload: error });

export const deleteRequest = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REQUEST });
    await authAxios.delete(`todos/${id}`);
    dispatch(deleteSuccess());
  } catch (e) {
    dispatch(deleteFailure(e));
  }
};

export const updateSuccess = () => ({ type: UPDATE_SUCCESS });

export const updateFailure = (error) => ({ type: UPDATE_FAILURE, payload: error });

export const updateRequest = (todo) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_REQUEST });
    await authAxios({
      url: '/todos/update',
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(todo),
    });
    dispatch(updateSuccess());
  } catch (e) {
    dispatch(updateFailure(e));
  }
};

export const completeSuccess = () => ({ type: COMPLETE_SUCCESS });

export const completeFailure = (error) => ({ type: COMPLETE_FAILURE, payload: error });

export const completeRequest = (todo) => async (dispatch) => {
  try {
    dispatch({ type: COMPLETE_REQUEST });
    await authAxios({
      url: '/todos/complete',
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(todo),
    });
    dispatch(completeSuccess());
  } catch (e) {
    dispatch(completeFailure(e));
  }
};

export const clearCompletedSuccess = () => ({ type: CLEAR_COMPLETED_SUCCESS });

export const clearCompletedFailure = (error) => ({ type: CLEAR_COMPLETED_FAILURE, payload: error });

export const clearCompletedRequest = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_COMPLETED_REQUEST });
    await authAxios.put('/todos/clear-completed');
    dispatch(clearCompletedSuccess());
  } catch (e) {
    dispatch(clearCompletedFailure(e));
  }
};

export const updateOnline = (isOnline) => ({type: UPDATE_STATUS, payload: isOnline});
