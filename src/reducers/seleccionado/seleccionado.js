import { createSelector } from 'reselect';
import { SET_EXPEDIENTE_SELECTED_DATOS } from "../../actions/expedientes/types";


const seleccionado = (state = {}, action) => {
 
  switch (action.type) {

    case SET_EXPEDIENTE_SELECTED_DATOS:
      console.log("SET_EXPEDIENTE");
      console.log("payload");
      const {  Fecha_Entrada, Id_Expediente, Id_Trabajo } = action.payload;
    
      return {
        ...state, [Id_Expediente+'-'+Id_Trabajo ]: { ...state[Fecha_Entrada], selectedData: action.payload, expedienteDataDate: new Date() }
        };
        default:
        return state;
    }
}


export default seleccionado;