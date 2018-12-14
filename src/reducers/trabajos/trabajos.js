import { FETCH_TIPOS_TRABAJO, FETCH_TRABAJOS_ERROR, FETCH_TIPOS_AUTORIZACION,
   FETCH_FASES_TRABAJOS, FETCH_ESTRUCTURA_DOCUMENTAL_TRABAJO, FILES_TO_UPLOAD,
   FETCH_GRUPOS_RAIZ, FETCH_FUNCIONES_TIPOLOGIA, ADD_AGENTE_TRABAJO, 
   DELETE_AGENTE_TRABAJO, EDIT_AGENTE_TRABAJO } from "../../actions/trabajos/types";
import { RESULTADOSBUSQUEDA } from "../../actions/expedientes/types";

import { PURGE } from 'redux-persist';

const initialState = {
  tiposTrabajos: { GruposTematicos: [{ Nombre: "Edi" }, { Nombre: "Ei" }] }, 
  tiposAutorizacion: { Tipos_autorizacion_municipal: [] }, 
  fasesTrabajos: { FasesTrabajos: [] }, loading: true, 
  promotoresTrabajoSelec: [],
  /**Este es la seleccion de arquitectos */
  agentesTrabajoSelected: [],
  /**Este es el resultado de la busqueda */
  OtrosAgentesTrabajoSelec: [],
  funcionesTipologia: [],
  colegiadosAgentesTrabajo: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GRUPOS_RAIZ:
          return{
              ...state,
              gruposRaiz: action.payload,
          };

    case FETCH_FUNCIONES_TIPOLOGIA:
         return{
           ...state,
           funcionesTipologia: action.payload
         }

    case ADD_AGENTE_TRABAJO:
         let agente = action.payload;
         let newAgent = {
           Id_Entidad: agente.Id_Entidad,
           Id_Colegiado: agente.Id_Colegiado, 
           Nif: agente.Nif,
           Nombre: `${agente.Nombre} ${agente.Apellido1} ${agente.Apellido2}`,
           Porciento: agente.Porciento ? agente.Porciento : 0,
           Funciones: agente.Funciones ? agente.Funciones : [],
           Agente: agente
          }
         return{
           ...state,
           agentesTrabajoSelected: [...state.agentesTrabajoSelected,newAgent]
         }

    case DELETE_AGENTE_TRABAJO:
         return{
           ...state,
           agentesTrabajoSelected: [...state.agentesTrabajoSelected].filter(element=> element.Id_Colegiado !== action.payload)
         }

    case EDIT_AGENTE_TRABAJO:
         return{
           ...state,
           colegiadosAgentesTrabajo: [action.payload]
         }

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
        case 'otrosagentes':
          const { OtrosAgentes } = action.payload.data.data;
          return {
            ...state,
            OtrosAgentesTrabajoSelec: OtrosAgentes
          }

        case 'colegiados':
          const {Colegiados} = action.payload.data.data;
          return{
            ...state,
            colegiadosAgentesTrabajo: Colegiados
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
      return initialState;
    case PURGE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
