import { FETCH_TIPOS_TRABAJO, FETCH_TRABAJOS_ERROR, FETCH_TIPOS_AUTORIZACION,
   FETCH_FASES_TRABAJOS, FETCH_ESTRUCTURA_DOCUMENTAL_TRABAJO, FILES_TO_UPLOAD,
   FETCH_GRUPOS_RAIZ, FETCH_COMUNICACION_ENCARGO } from "../../actions/trabajos/types";
import { RESULTADOSBUSQUEDA } from "../../actions/expedientes/types";

import { PURGE } from 'redux-persist';

const initialState = {
  tiposTrabajos: { GruposTematicos: [{ Nombre: "Edi" }, { Nombre: "Ei" }] }, 
  tiposAutorizacion: { Tipos_autorizacion_municipal: [] }, 
  fasesTrabajos: { FasesTrabajos: [] }, loading: true, 
  promotoresTrabajoSelec: [{}]
};
const reducer = (state = initialState, action) => {

  switch (action.type) {
      case FETCH_COMUNICACION_ENCARGO:
          return{
              ...state,
              comunicacionEncargo: action.payload,
          };
    case FETCH_GRUPOS_RAIZ:
          return{
              ...state,
              gruposRaiz: action.payload,
          };

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

    case RESULTADOSBUSQUEDA:


      switch (action.payload.tipoBusqueda) {

        case 'OtrosAgentes':
          const { OtrosAgentes } = action.payload.data.data;
          return {
            ...state,
            OtrosAgentesTrabajoSelec: OtrosAgentes

          }
        default:
          return {
            ...state
          }
      }

    case FETCH_FASES_TRABAJOS:
      return {
        ...state,
        fasesTrabajos: action.payload,
      };
    case FETCH_ESTRUCTURA_DOCUMENTAL_TRABAJO:
      return {
        ...state,
        estructuraDocumentalTrabajo: action.payload,
      };
    case FILES_TO_UPLOAD:
    console.table(action.payload)
      return {
        ...state,
        filesToUpload: action.payload,
      };
    case FETCH_TRABAJOS_ERROR:
        return {
            ...state,
            error: action.payload,
        };
    case PURGE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
