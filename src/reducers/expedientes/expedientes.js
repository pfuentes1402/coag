import { FETCH_UBICACION_SUCCESS } from "../../actions/expedientes/types";
import { FETCH_SAVE_ADRESS_TO_STORE } from "../../actions/expedientes/types";
import { FETCH_EXPEDIENTSAVE_TO_STORE } from "../../actions/expedientes/types";



export const FETCH_EXPEDIENTES_INIT = 'FETCH_EXPEDIENTES_INIT';
export const FETCH_EXPEDIENTES_SUCCESS = 'FETCH_EXPEDIENTES_SUCCESS';
export const FETCH_EXPEDIENTES_ERROR = 'FETCH_EXPEDIENTES_ERROR';
export const FETCH_EXPEDIENTE_SUCCESS = 'FETCH_EXPEDIENTE_SUCCESS';

const initialState = [];

const initialStateb = [];
const initialStatec = [];
const initialstated =[];
const initialstatee =[];


const reducer = (state = {arbolCompleto : initialState, loading : true, address: '',
 trabajos: initialState,addressreduc:initialStatec, adressValidated : initialstated, ExpedientNew:initialstatee}, action) => {
 
  switch (action.type) {
    case FETCH_EXPEDIENTES_SUCCESS: {
    return {
      ...state,            
      arbolCompleto: action.payload,
    };    
  }
    case FETCH_EXPEDIENTES_ERROR:
      return initialState;

      case FETCH_UBICACION_SUCCESS:


      const {Datos_Completos} = action.payload;

      const addressreduc=[
          {Calle: Datos_Completos[0].Calle, Numero: Datos_Completos[0].Numero,
              Piso: Datos_Completos[0].Piso, Codigo_Postal: Datos_Completos[0].Codigo_Postal, municipio: Datos_Completos[0].Concello, Id_Concello:Datos_Completos[0].Id_Concello, Georeferencia:""}
      ];
          console.log(addressreduc);
    return {
      ...state,            
      address: action.payload,
        addressreduc: addressreduc,
    }; 
     
      case FETCH_EXPEDIENTE_SUCCESS:
      return {
        ...state,            
        trabajos: action.payload,
      };
      case FETCH_EXPEDIENTSAVE_TO_STORE:
      return {
        ...state,            
        ExpedientNew: action.payload,
      };  
      case FETCH_SAVE_ADRESS_TO_STORE:

      console.log( action.payload);     
      return {
        ...state,
        adressValidated: state.adressValidated.concat([action.payload]) ,
      }        
      
    default:
      return state;
  }
};

export default reducer;
