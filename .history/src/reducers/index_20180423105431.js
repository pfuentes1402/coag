import { combineReducers } from 'redux';

import ExpedientesReducer from './expedientes/expedientes';
import UserReducer from './user/user';

const rootReducer = combineReducers({
    expedientes: ExpedientesReducer,
    user:UserReducer,
  });

export default rootReducer;