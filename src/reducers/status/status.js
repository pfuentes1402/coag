import { FETCH_EXPEDIENTES_SUCCESS } from "../../actions/expedientes/types";
import { FETCH_SHOW_MODAL, FETCH_HIDE_MODAL } from "../../actions/interfaz/types"
import { PURGE } from 'redux-persist';

const initialState = { loading : true, modalAcciones:false };
const reducer = (state = initialState, action) => {
 
  switch (action.type) {
    case FETCH_EXPEDIENTES_SUCCESS:
     
      return {
        ...state,            
        loading: false,
      };
    case FETCH_SHOW_MODAL:
     
      return {
        ...state,            
        modalAcciones: true,
      };
    case FETCH_HIDE_MODAL:
     
      return {
        ...state,            
        modalAcciones: false,
      };
    
  case PURGE:                        
      return initialState; 
  default:
      return state;
  }
};

export default reducer;
