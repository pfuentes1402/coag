import { FETCH_EXPEDIENTES_SUCCESS } from "../../actions/expedientes/types";
import { PURGE } from 'redux-persist';

const initialState = { loading : true };
const reducer = (state = initialState, action) => {
 
  switch (action.type) {
    case FETCH_EXPEDIENTES_SUCCESS:
     
      return {
        ...state,            
        loading: false,
      };
    
  case PURGE:                        
      return initialState; 
  default:
      return state;
  }
};

export default reducer;
