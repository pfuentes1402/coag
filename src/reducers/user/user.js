import { FETCH_DATOSDEUSUARIO_SUCCESS,EXPEDIENTESSUSCEPTIBLESTRABAJO  } from "../../actions/usuarios/types";
import { FETCH_LOGIN_SUCCESS } from "../../actions/usuarios/types";
import { FETCH_LOGIN_FAIL,  REFRESH_TOKEN_, ULTIMOSTRABAJOS } from "../../actions/usuarios/types";
import { PURGE } from 'redux-persist';


const initialstate ={ DatosUsuarioValidado: {
  "Id": "",
"Usuario": "",
"Id_Colegiado":"" ,
"Id_Entidad":"",
"Es_Usuario_Delegado":"",
"Es_Sociedad":"",
"Mail":"",
"Fecha_Ultima_Conexion":""
},

trabajosSusceptiblestrabajo:[{}],
ultimostrabajos:[{}]
,
DatosConfiguracionesUsuario:{
"Id": "",
"Idioma_Predefinido": "",
"Numero_Trabajos_Acciones_Pendientes": ""
},
token:"",

mensaje:"",
data: {Expedientes:[]} };
const reducer = (state = initialstate, action) => {
      
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
              case ULTIMOSTRABAJOS:
              return{
                ...state,
                ultimostrabajos: action.payload,            
              };
              case EXPEDIENTESSUSCEPTIBLESTRABAJO:
              return{
                ...state,
               trabajosSusceptiblestrabajo: action.payload,            
              };
           
       
        case PURGE:
                        
              return initialstate; 
        default:
          return state;
    }
  };

 export default reducer;
