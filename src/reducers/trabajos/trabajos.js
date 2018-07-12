import { FETCH_TIPOS_TRABAJO, FETCH_TRABAJOS_ERROR, FETCH_TIPOS_AUTORIZACION, FETCH_FASES_TRABAJOS } from "../../actions/trabajos/types";
import { PURGE } from 'redux-persist';

const initialState = {tiposTrabajos : { GruposTematicos: [{Nombre: "Edi"},{Nombre: "Ei"}] }
, tiposAutorizacion: {Tipos_autorizacion_municipal:[]}, fasesTrabajos:{FasesTrabajos:[]}, loading : true };
const reducer = (state = initialState, action) => {
 
  switch (action.type) {
    case FETCH_TIPOS_TRABAJO:
      console.log(action.payload);
      return {
        ...state,            
        tiposTrabajos: action.payload,
      };
    case FETCH_TIPOS_AUTORIZACION:
      return {
        ...state,            
        tiposAutorizacion: action.payload,
      };
    case FETCH_FASES_TRABAJOS:
      return {
        ...state,            
        fasesTrabajos: action.payload,
      };
    case FETCH_TRABAJOS_ERROR:
      return initialState;
  case PURGE:                        
      return initialState; 
  default:
      return state;
  }
};

export default reducer;
