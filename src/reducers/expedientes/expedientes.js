import { FETCH_UBICACION_SUCCESS } from "../../actions/expedientes/types";


export const FETCH_EXPEDIENTES_INIT = 'FETCH_EXPEDIENTES_INIT';
export const FETCH_EXPEDIENTES_SUCCESS = 'FETCH_EXPEDIENTES_SUCCESS';
export const FETCH_EXPEDIENTES_ERROR = 'FETCH_EXPEDIENTES_ERROR';
export const FETCH_EXPEDIENTE_SUCCESS = 'FETCH_EXPEDIENTE_SUCCESS';

const initialState = [];

const initialStateb = [];
const initialStatec = [];


const reducer = (state = {arbolCompleto : initialState, loading : true, address: '', trabajos: initialState,addressreduc:initialStatec}, action) => {
 
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
      const addressreduc=[];
        addressreduc.push({Calle : Datos_Completos[0].Calle});
          addressreduc.push({Numero : Datos_Completos[0].Numero});
          addressreduc.push({Piso : Datos_Completos[0].Piso});
          addressreduc.push({Codigo_Postal : Datos_Completos[0].Codigo_Postal});
          addressreduc.push({Concello : Datos_Completos[0].Concello});
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
        
      
    default:
      return state;
  }
};

export default reducer;
