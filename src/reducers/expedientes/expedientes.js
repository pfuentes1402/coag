import { FETCH_EXPEDIENTES } from '../../actions/expedientes';
export const FETCH_EXPEDIENTES_INIT = 'FETCH_EXPEDIENTES_INIT';
export const FETCH_EXPEDIENTES_SUCCESS = 'FETCH_EXPEDIENTES_SUCCESS';
export const FETCH_EXPEDIENTES_ERROR = 'FETCH_EXPEDIENTES_ERROR';

const initialState = [];

const reducer = (state = {data : initialState, loading : true}, action) => {
  console.log("entra reducer"+action.type);
  switch (action.type) {
    case FETCH_EXPEDIENTES_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case FETCH_EXPEDIENTES_ERROR:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
