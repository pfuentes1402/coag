import { FETCH_TIPOS_TRABAJO, FETCH_TRABAJOS_ERROR, FETCH_TIPOS_AUTORIZACION, FETCH_FASES_TRABAJOS } from "../../actions/trabajos/types";
import { RESULTADOSBUSQUEDA } from "../../actions/expedientes/types";

import { PURGE } from 'redux-persist';

const initialState = {tiposTrabajos : { GruposTematicos: [{Nombre: "Edi"},{Nombre: "Ei"}] }
, tiposAutorizacion: {Tipos_autorizacion_municipal:[]}, fasesTrabajos:{FasesTrabajos:[]}, loading : true,promotoresTrabajoSelec:[{}] };
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
    
      case RESULTADOSBUSQUEDA:
      console.log(action.payload.data.data.Promotores);
            
      switch(action.payload.tipoBusqueda){
        
           case 'promotores':
           const {Promotores} = action.payload.data.data;
           return{
             ...state,
             promotoresTrabajoSelec:Promotores
           }                                 
 
       default:              
       return{
         state
       }
      }  

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
