import { FETCH_UBICACION_SUCCESS, FETCH_UBICACION_UPDATE } from "../../actions/expedientes/types";
import { FETCH_SAVE_ADRESS_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_EXPEDIENTSAVE_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_EXPEDIENTE_SUCCESS_EXP } from "../../actions/expedientes/types";
import { FETCH_SAVE_AGENTES_DATA } from "../../actions/expedientes/types";
import { FETCH_SAVE_TRABAJO_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_DATAFORTREETRABAJO_SUCCESS, RESULTADOSBUSQUEDA, SET_EXPEDIENTE_SELECTED_DATOS_TRABAJOFICHA,
   SET_EXPEDIENTE_SELECTED_DATOS,SET_EXPEDIENTE_SELECTED_DATOS_TRABAJO,ELIMINAR_TABLA } from "../../actions/expedientes/types";

import { PURGE } from 'redux-persist';

export const FETCH_EXPEDIENTES_INIT = 'FETCH_EXPEDIENTES_INIT';
export const FETCH_EXPEDIENTES_SUCCESS = 'FETCH_EXPEDIENTES_SUCCESS';
export const FETCH_EXPEDIENTES_ERROR = 'FETCH_EXPEDIENTES_ERROR';
export const FETCH_EXPEDIENTE_SUCCESS = 'FETCH_EXPEDIENTE_SUCCESS';


const initialState = {arbolEstructuraDocumentalTrabajo : {}, loading : true, address: {Datos_Completos:[{ Id_Pais: '',
Id_Autonomia: '',
Id_Provincia: '',
Id_Concello: '',
Calle: '',
Numero: '',
Planta: '',
Codigo_Postal: '',
Concello: '',
Provincia: '',
Autonomia: '',
Pais: ''}]},
trabajos: [{}],
promotores:[{}],
addressreducida:[],
adressValidated : [], ExpedientNew:{},expedientes:{},
arrayReferencias : [],
expedienteData:{Expediente:[],Emplazamientos:[{}]},
 datosAgentes:{},
 datosTrabajo:{},arbolEstructuraTrabajoRefactor:[{'id_expediente':68885}], selectedData:{expedieteotrabajo:{}, trabajoData:{}}, trabajoData:{Trabajos:[{}]} };
const expedientes = (state = initialState, action) => {
 
  switch (action.type) {
      case FETCH_EXPEDIENTES_SUCCESS:
    return{
      ...state,
      expedientes: action.payload,            
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
        return {
              ...state,            
              address: action.payload,
            };
        break;
      case FETCH_UBICACION_UPDATE:
          return {
              ...state,
              address: action.payload,
          };
          break;
      case ELIMINAR_TABLA:
         
          let arraytEMP =  state.addressreducida;
          let arraytEMP2 =  state.arrayReferencias;

          
          arraytEMP.splice(action.payload[0], 1)
          arraytEMP2.splice(action.payload[0], 1)
         

        return {
              ...state,            
              addressreducida:arraytEMP,
              arrayReferencias:arraytEMP2,
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
         
            
         const expOtr = Id_Trabajo!==null?'Trabajo':'expediente';
                return{
                  ...state,
                 // [Id_Expediente+'-'+Fecha_Entrada ]: { ...state[Fecha_Entrada], trabajoData: action.payload }
                  trabajoData:action.payload.data,
                  expedieteotrabajo:expOtr,
                };
    case SET_EXPEDIENTE_SELECTED_DATOS_TRABAJOFICHA:
   
                return{
                  ...state,
                  datosExpParaFicha:action.payload
                }
    case FETCH_EXPEDIENTSAVE_TO_STORE:
    
        return {
          ...state,            
          ExpedientNew: action.payload,
        };  
    case FETCH_SAVE_ADRESS_TO_STORE:
     
    
          const addressreducida=[
              {Calle:action.payload[0].Calle, Numero: action.payload[0].Numero,
                  Piso: action.payload[0].Piso, Codigo_Postal: action.payload[0].Codigo_Postal,
                  municipio: action.payload[0].Concello, Provincia: action.payload[0].Provincia , Id_Concello:action.payload[0].Id_Concello, Georeferencia:"", refcatastral:action.payload[1]}
          ];

        return {
          ...state,
          adressValidated: state.adressValidated.concat([action.payload[0]]),
          addressreducida:state.addressreducida.concat(addressreducida),
          arrayReferencias:state.arrayReferencias.concat([action.payload[1]])
         
        }  
    case FETCH_EXPEDIENTE_SUCCESS_EXP:
        return {
          ...state,
          expedienteData: action.payload.data ,
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

            



     case PURGE:
                        
     return initialState;    
      
    default:
      return state;
  }
};










export default expedientes;
