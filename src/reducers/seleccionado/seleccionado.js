
import { SET_EXPEDIENTE_SELECTED } from "../../actions/expedientes/types";


const seleccionado = (state = {}, action) => {
 
  switch (action.type) {

    case SET_EXPEDIENTE_SELECTED:
      console.log("SET_EXPEDIENTE");
      console.log("payload");
      const {  Fecha_Entrada } = action.payload;
      const {data} = action.payload;
      return {
        ...state, [Fecha_Entrada ]: { ...state[Fecha_Entrada], selectedData: action.payload, expedienteDataDate: new Date() }
        };
        default:
        return state;
    }
}

export default seleccionado;