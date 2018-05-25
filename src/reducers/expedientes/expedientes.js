
import { FETCH_UBICACION_SUCCESS } from "../../actions/expedientes/types";
import { FETCH_SAVE_ADRESS_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_EXPEDIENTSAVE_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_EXPEDIENTE_SUCCESS_EXP } from "../../actions/expedientes/types";
import { FETCH_SAVE_AGENTES_DATA } from "../../actions/expedientes/types";
import { FETCH_SAVE_TRABAJO_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_DATAFORTREETRABAJO_SUCCESS } from "../../actions/expedientes/types";
import {SET_EXPEDIENTE_SELECTED_DATOS} from "../../actions/expedientes/types";
import {SET_EXPEDIENTE_SELECTED_DATOS_TRABAJO} from "../../actions/expedientes/types";





export const FETCH_EXPEDIENTES_INIT = 'FETCH_EXPEDIENTES_INIT';
export const FETCH_EXPEDIENTES_SUCCESS = 'FETCH_EXPEDIENTES_SUCCESS';
export const FETCH_EXPEDIENTES_ERROR = 'FETCH_EXPEDIENTES_ERROR';
export const FETCH_EXPEDIENTE_SUCCESS = 'FETCH_EXPEDIENTE_SUCCESS';


const initialState = [];
const expedientes = (state = {arbolEstructuraDocumentalTrabajo : {}, loading : true, address: '',
 trabajos: {},addressreducida:{}, adressValidated : {}, ExpedientNew:{},expedienteData:{}, datosAgentes:{},
  datosTrabajo:{},arbolEstructuraTrabajoRefactor:{}, selectedData:{expedieteotrabajo:{}, trabajoData:{}}}, action) => {
 
  switch (action.type) {
    case FETCH_EXPEDIENTES_SUCCESS: 
 
      return {
        ...state,            
        arbolEstructuraDocumentalTrabajo: action.payload,
      };   
      case FETCH_DATAFORTREETRABAJO_SUCCESS: 
 
    
      //TODO: Ver como grabar esto dento de cada trabajo, para tewner ahi su estructura documental
      return {
        ...state,            
        arbolEstructuraTrabajoRefactor:action.payload
      };
  
      
      
    
    case FETCH_EXPEDIENTES_ERROR:
      return {initialState};

    case FETCH_UBICACION_SUCCESS:

        const {Datos_Completos} = action.payload;
        const addressreducida=[
            {Calle: Datos_Completos[0].Calle, Numero: Datos_Completos[0].Numero,
                Piso: Datos_Completos[0].Piso, Codigo_Postal: Datos_Completos[0].Codigo_Postal, municipio: Datos_Completos[0].Concello, Id_Concello:Datos_Completos[0].Id_Concello, Georeferencia:""}
        ];
         
      return {
            ...state,            
            address: action.payload,
            addressreducida: addressreducida,
          }; 
    case SET_EXPEDIENTE_SELECTED_DATOS:
    const {Id_Trabajo} = action.payload;
          return{
            ...state,
            selectedData: action.payload,
            expedieteotrabajo: Id_Trabajo?'trabajo':'expediente',
            //trabajoData:action.payload,
          };
          case SET_EXPEDIENTE_SELECTED_DATOS_TRABAJO:
         
         const {  Fecha_Entrada,Id_Expediente } = action.payload.Trabajos[0];
                return{
                  ...state,
                 // [Id_Expediente+'-'+Fecha_Entrada ]: { ...state[Fecha_Entrada], trabajoData: action.payload }
                  trabajoData:action.payload,
                };
    case FETCH_EXPEDIENTSAVE_TO_STORE:
    
      return {
        ...state,            
        ExpedientNew: action.payload,
      };  
    case FETCH_SAVE_ADRESS_TO_STORE:       
      return {
        ...state,
        adressValidated: state.adressValidated.concat([action.payload]) 
      }  
    case FETCH_EXPEDIENTE_SUCCESS_EXP:
       
        return {
          ...state,
          expedienteData: action.payload ,
        }
    /*case SET_EXPEDIENTE_SELECTED:
      
      
      const {  Fecha_Entrada } = action.payload;
      const {data} = action.payload;
      return {
        ...state, [Fecha_Entrada ]: { ...state[Fecha_Entrada], selectedData: action.payload, expedienteDataDate: new Date() }
        };*/
    
  
     case FETCH_SAVE_AGENTES_DATA:
     return {
       ...state,
       datosAgentes:action.payload,
     } 
     case FETCH_SAVE_TRABAJO_TO_STORE:
          
     const id=action.payload.Trabajos[0].Id_Trabajo;
     const index = state.datosTrabajo.findIndex(el => el.Trabajos[0].Id_Trabajo === id);
    
     if(index===-1){
      return{
        ...state,
          datosTrabajo:state.datosTrabajo.concat([action.payload])
        }
        
       
      
     }else{
      return state;
     }

     /*return {
      ...state,
       
       datosTrabajo:state.datosTrabajo.concat([action.payload]),
     } */
         
      
    default:
      return state;
  }
};










export default expedientes;
