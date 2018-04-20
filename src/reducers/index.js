import { combineReducers } from 'redux';

import ExpedientesReducer from './expedientes/expedientes';

const rootReducer = combineReducers({
    expedientes: ExpedientesReducer,
  });

export default rootReducer;