import { createSelector } from 'reselect';
import { SET_EXPEDIENTE_SELECTED_DATOS } from "../../actions/expedientes/types";
import { FETCH_SAVE_SELECTED_NODE_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_SAVE_SELECTED_EXP_TO_STORE } from "../../actions/expedientes/types";






const seleccionado = (state = {}, action) => {
 
  switch (action.type) {

    case SET_EXPEDIENTE_SELECTED_DATOS:
     
      const {  Fecha_Entrada, Id_Expediente, Id_Trabajo } = action.payload;
    
      return {
        ...state, [Id_Expediente+'-'+Id_Trabajo ]: { ...state[Fecha_Entrada], selectedData: action.payload, expedienteDataDate: new Date() }
        };

    case FETCH_SAVE_SELECTED_NODE_TO_STORE:
    
    return {
      ...state,            
      selectedNode:action.payload
    };
    case FETCH_SAVE_SELECTED_EXP_TO_STORE:
    
    return {
      ...state,            
      selectedExp:action.payload
    };
        default:
        return state;
    }
}


export default seleccionado;