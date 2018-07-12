import { FETCH_DATOSDEUSUARIO_SUCCESS } from "../../actions/usuarios/types";
import { FETCH_LOGIN_SUCCESS } from "../../actions/usuarios/types";
import { FETCH_LOGIN_FAIL,  REFRESH_TOKEN_ } from "../../actions/usuarios/types";
import { PURGE } from 'redux-persist';



const reducer = (state = { DatosUsuarioValidado: {
        "Id": "",
      "Usuario": "",
      "Id_Colegiado":"" ,
      "Id_Entidad":"",
      "Es_Usuario_Delegado":"",
      "Es_Sociedad":"",
      "Mail":"",
      "Fecha_Ultima_Conexion":""
    },
    DatosConfiguracionesUsuario:{
      "Id": "",
      "Idioma_Predefinido": "",
      "Numero_Trabajos_Acciones_Pendientes": ""
    },
    token:"",
    
    mensaje:"",
    data: {Expedientes:[]} }, action) => {
      
      switch (action.type) {
        case FETCH_DATOSDEUSUARIO_SUCCESS:
           
              return{
                ...state,
                data: action.payload,            
              };
        case FETCH_LOGIN_SUCCESS:
       
        const { DatosConfiguracionesUsuario,DatosUsuarioValidado,token} = action.payload.data;
       
              return{
                ...state,
                DatosConfiguracionesUsuario: DatosConfiguracionesUsuario[0],     
                DatosUsuarioValidado: DatosUsuarioValidado[0],     
                token:token,
                mensaje:  'login Correcto',                    
              };
        case REFRESH_TOKEN_:
              const {tokenFresh} = action.payload.data.headers.token;
              return{
                ...state,
                
                token:tokenFresh,
                                
              };
              case FETCH_LOGIN_FAIL:
              return{
                ...state,
                mensaje: 'error en el login',            
              };
       
        case PURGE:
              console.log("PURGING!!!!"); 
              return state; 
        default:
          return state;
    }
  };

 export default reducer;
