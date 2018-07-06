import { createSelector } from 'reselect';
import { SET_EXPEDIENTE_SELECTED_DATOS } from "../../actions/expedientes/types";
import { FETCH_SAVE_SELECTED_NODE_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_SAVE_SELECTED_EXP_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_SAVE_SELECTED_EXPEDIENTE_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_EXPEDIENTE_SUCCESS_EXP } from "../../actions/expedientes/types";







const seleccionado = (state = {selectedExpediente:'inicial'}, action) => {
 
  switch (action.type) {

    case SET_EXPEDIENTE_SELECTED_DATOS:
    console.log('Payload de seleccionado');
    console.log(action.payload);
    
      const {  Fecha_Entrada, Id_Expediente, Id_Trabajo } = action.payload;      
      const expOtr = Id_Trabajo!=null?'Trabajo':'Expediente';
    
      return {
        ...state, [Id_Expediente+'-'+Id_Trabajo ]: { ...state[Fecha_Entrada], selectedData: action.payload, expedienteDataDate: new Date() , expedieteotrabajo:expOtr }
        };

    case FETCH_SAVE_SELECTED_NODE_TO_STORE:
    
    return {
      ...state,            
      selectedNode:action.payload
    };
    case FETCH_EXPEDIENTE_SUCCESS_EXP:
    
    return {
      ...state,            
      selectedExpediente:action.payload.data
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