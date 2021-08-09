import { combineReducers } from 'redux';

import todoReducer from './todoReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  todo: todoReducer,
  currentUser: userReducer
});

export default rootReducer;
