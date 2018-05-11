import { FETCH_UBICACION_SUCCESS } from "../../actions/expedientes/types";
import { FETCH_SAVE_ADRESS_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_EXPEDIENTSAVE_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_EXPEDIENTE_SUCCESS_EXP } from "../../actions/expedientes/types";



export const FETCH_EXPEDIENTES_INIT = 'FETCH_EXPEDIENTES_INIT';
export const FETCH_EXPEDIENTES_SUCCESS = 'FETCH_EXPEDIENTES_SUCCESS';
export const FETCH_EXPEDIENTES_ERROR = 'FETCH_EXPEDIENTES_ERROR';
export const FETCH_EXPEDIENTE_SUCCESS = 'FETCH_EXPEDIENTE_SUCCESS';


const initialState = [];
const reducer = (state = {arbolEstructuraDocumentalTrabajo : [], loading : true, address: '',
 trabajos: [],addressreducida:[], adressValidated : [], ExpedientNew:[],expedienteData:[]}, action) => {
 
  switch (action.type) {
    case FETCH_EXPEDIENTES_SUCCESS: 
      return {
        ...state,            
        arbolEstructuraDocumentalTrabajo: action.payload,
      };    
    
    case FETCH_EXPEDIENTES_ERROR:
      return initialState;

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
    
    case FETCH_EXPEDIENTSAVE_TO_STORE:
      return {
        ...state,            
        ExpedientNew: action.payload,
      };  
    case FETCH_SAVE_ADRESS_TO_STORE:       
      return {
        ...state,
        adressValidated: state.adressValidated.concat([action.payload]) ,
      }  
    case FETCH_EXPEDIENTE_SUCCESS_EXP:
       
        return {
          ...state,
          expedienteData: action.payload ,
        }  
      
    default:
      return state;
  }
};

export default reducer;
