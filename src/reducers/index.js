import { combineReducers } from 'redux';

import ExpedientesReducer from './expedientes/expedientes';
import UserReducer from './user/user';
import { reducer as reduxFormReducer } from 'redux-form';

const rootReducer = combineReducers({
    expedientes: ExpedientesReducer,
    user:UserReducer,
    form: reduxFormReducer,
  });

export default rootReducer;