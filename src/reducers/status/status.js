import { FETCH_EXPEDIENTES_SUCCESS } from "../../actions/expedientes/types";
import { FETCH_SHOW_MODAL, FETCH_HIDE_MODAL, CAMBIAESTADOMODAL, OCULTACAMBIAESTADOMODAL } from "../../actions/interfaz/types"
import { GOEXPEDIENTES } from "../../actions/usuarios/types"
import { PURGE } from 'redux-persist';

const initialState = { loading : true, modalAcciones:false,selectedAction:0,modalLoading:true,modal:false };
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
      case CAMBIAESTADOMODAL:
      return{
        ...state,
       modalLoading: false,            
      };
      case OCULTACAMBIAESTADOMODAL:
      return{
        ...state,
       modalLoading: true,            
      };
      case GOEXPEDIENTES:
     return{
      ...state,
      modalAcciones:false,
      }
    
  case PURGE:                        
      return initialState; 
  default:
      return state;
  }
};

export default reducer;
