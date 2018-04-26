import { FETCH_UBICACION_SUCCESS } from "../../actions/expedientes/types";


export const FETCH_EXPEDIENTES_INIT = 'FETCH_EXPEDIENTES_INIT';
export const FETCH_EXPEDIENTES_SUCCESS = 'FETCH_EXPEDIENTES_SUCCESS';
export const FETCH_EXPEDIENTES_ERROR = 'FETCH_EXPEDIENTES_ERROR';
export const FETCH_EXPEDIENTE_SUCCESS = 'FETCH_EXPEDIENTE_SUCCESS';

const initialState = [];

const initialStateb = [];


const reducer = (state = {arbolCompleto : initialState, loading : true, address: '', trabajos: initialState}, action) => {
 
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
    return {
      ...state,            
      adress: action.payload,
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
