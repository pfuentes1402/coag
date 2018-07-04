import { FETCH_DATOSDEUSUARIO_SUCCESS } from "../../actions/usuarios/types";
import { FETCH_LOGIN_SUCCESS } from "../../actions/usuarios/types";
import { FETCH_LOGIN_FAIL } from "../../actions/usuarios/types";



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
    }
    ,
    Token:"",
    mensaje:""
    ,
    data: {Expedientes:[]} }, action) => {
      
      switch (action.type) {
        case FETCH_DATOSDEUSUARIO_SUCCESS:
           
              return{
                ...state,
                data: action.payload,            
              };
        case FETCH_LOGIN_SUCCESS:
       
        const { DatosConfiguracionesUsuario,DatosUsuarioValidado} = action.payload.data;
       
              return{
                ...state,
                DatosConfiguracionesUsuario: DatosConfiguracionesUsuario[0],     
                DatosUsuarioValidado: DatosUsuarioValidado[0],     
                mensaje:  'login Correcto',                    
              };
        case FETCH_LOGIN_FAIL:
              return{
                ...state,
                mensaje: 'error en el login',            
              };
        default:
          return state;
    }
  };

 export default reducer;
