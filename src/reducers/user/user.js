import { FETCH_DATOSDEUSUARIO_SUCCESS } from "../../actions/usuarios/types";

const initialState = { name: "userName", config: "useConfig" };

const reducer = (state = { PersonalData: initialState, data: {Expedientes:[]} }, action) => {
  
  switch (action.type) {
    case FETCH_DATOSDEUSUARIO_SUCCESS:
        
          return{
            ...state,
            data: action.payload,            
          };
    default:
      return state;
  }
};

export default reducer;
