import { FETCH_TIPOS_TRABAJO, FETCH_TRABAJOS_ERROR, FETCH_TIPOS_AUTORIZACION } from "../../actions/trabajos/types";

const initialState = [];
const reducer = (state = {tiposTrabajos : { GruposTematicos: [{Nombre: "Edi"},{Nombre: "Ei"}] }
, tiposAutorizacion: {Tipos_autorizacion_municipal:[]}, loading : true }, action) => {
 
  switch (action.type) {
    case FETCH_TIPOS_TRABAJO:
      return {
        ...state,            
        tiposTrabajos: action.payload,
      };
    case FETCH_TIPOS_AUTORIZACION:
      return {
        ...state,            
        tiposAutorizacion: action.payload,
      };
    case FETCH_TRABAJOS_ERROR:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
