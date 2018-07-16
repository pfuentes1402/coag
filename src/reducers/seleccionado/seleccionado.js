
import { SET_EXPEDIENTE_SELECTED_DATOS } from "../../actions/expedientes/types";
import { FETCH_SAVE_SELECTED_NODE_TO_STORE } from "../../actions/expedientes/types";
import { CAMBIO_CONTENEDOR_CENTRAL_RESET } from "../../actions/trabajos/types";
import { CAMBIO_CONTENEDOR_CENTRAL } from "../../actions/expedientes/types";
import {
  FETCH_SAVE_SELECTED_EXPEDIENTE_TO_STORE, FETCH_EXPEDIENTES_SUCCESS } from "../../actions/expedientes/types";
import { BORRASELECTED } from "../../actions/usuarios/types";
import { PURGE } from 'redux-persist';


const initialState ={selectedExpediente:'inicial', expTrabajoParaCentral:'Home', expedienteActualtitulo:'',expedienteActualid:''};
const seleccionado = (state = initialState , action) => { 
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
    // case FETCH_EXPEDIENTE_SUCCESS_EXP:
    
    // return {
    //   ...state,            
    //   selectedExpediente:action.payload.data
    // };
    case FETCH_SAVE_SELECTED_EXPEDIENTE_TO_STORE:
   
    return {
      ...state,            
      selectedExp:action.payload,
      selectedExpediente: 'expediente',
      expedienteActualtitulo:action.payload.Titulo,
      expedienteActualid:action.payload.Id_Expediente,
      expTrabajoParaCentral:'expedientes',
    };
    case BORRASELECTED:
    
    return {
      ...state,        
      selectedExpediente: "",
      expTrabajoParaCentral: "Home",
    };
    case CAMBIO_CONTENEDOR_CENTRAL:    
    return {
      ...state,        
      
      expTrabajoParaCentral: 'trabajos'
    };
    case CAMBIO_CONTENEDOR_CENTRAL_RESET:    
    return {
      ...state,        
      
      expTrabajoParaCentral: 'expedientes'
    };
    case PURGE: 
      return initialState;

    default:
      return state;
    }
}


export default seleccionado;