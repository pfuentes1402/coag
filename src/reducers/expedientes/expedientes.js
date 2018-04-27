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

      const addressreduc=[
          {calle: Datos_Completos[0].Calle, numero: Datos_Completos[0].Numero,
              piso: Datos_Completos[0].Piso, cp: Datos_Completos[0].Codigo_Postal, municipio: Datos_Completos[0].Concello}
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
        
      
    default:
      return state;
  }
};

export default reducer;
