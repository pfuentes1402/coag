import { combineReducers } from 'redux';

import ExpedientesReducer from './expedientes/expedientes';
import TrabajosReducer from './trabajos/trabajos';
import UserReducer from './user/user';
import seleccionado from './seleccionado/seleccionado';
import status from './status/status';
import { localizeReducer} from 'react-localize-redux';

import { reducer as reduxFormReducer } from 'redux-form';


const rootReducer = combineReducers({
    expedientes: ExpedientesReducer,
    trabajos: TrabajosReducer,
    user:UserReducer,
    form: reduxFormReducer,
    seleccionado:seleccionado,
    status:status,
    localize:localizeReducer,
    
  });

export default rootReducer;