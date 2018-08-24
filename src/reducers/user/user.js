import { FETCH_DATOSDEUSUARIO_SUCCESS,EXPEDIENTESSUSCEPTIBLESTRABAJO , ACCIONESTRAMITARNUEVOTRABAJO, ACCIONESSOLICITARLOA,
  ACCIONESSOLICITARLI,ACCIONESCONVERTIRDIGITAL,ACCIONESCESAREXPEDIENTE } from "../../actions/usuarios/types";
  import { RESULTADOSBUSQUEDA, FILTROBUSQUEDA, FILTROACCIONES } from "../../actions/expedientes/types";
import { FETCH_LOGIN_SUCCESS } from "../../actions/usuarios/types";
import { FETCH_LOGIN_FAIL,  REFRESH_TOKEN_, ULTIMOSTRABAJOS, CAMBIASELECT } from "../../actions/usuarios/types";
import { FETCH_RESET_RESULT } from "../../actions/interfaz/types";
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

datosModal:[{tituloModal:0}],
tituloModal:'Inicial title',
filtroBusqueda:'',
filtroAcciones:'',
selectBusqueda:'',
ultimostrabajos:[{}],
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
              case CAMBIASELECT:
              return{
                ...state,
                selectBusqueda:action.payload,
              }
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
                datosModal:{
                  expedientes: action.payload.data.Expedientes,
                  tituloModal: 'Expedientes que se pueden modificar',
                  descripcion:'Utiliza los filtros para encontrar el expediente que quieres modificar y pulsa sobre él.'
                }                          
              };
              case RESULTADOSBUSQUEDA:
                const {Expedientes} = action.payload.data;
                return{
                  ...state,
                  datosModal:{
                    resultados:Expedientes
                  }
                }
                case FILTROBUSQUEDA:
                return{
                  ...state,
                  filtroBusqueda:action.payload
                }
                case FILTROACCIONES:
                return {
                  ...state,
                  filtroAcciones:action.payload
                }
              case ACCIONESTRAMITARNUEVOTRABAJO:                
                return{
                  ...state,
                  datosModal:{
                    expedientes: action.payload.data,
                    tituloModal: 'Expedientes que permiten tramitar nuevo trabajo',
                    descripcion:'Utiliza los filtros para encontrar el expediente existente en el que quieres tramitar un nuevo trabajo y pulsa sobre él.'
                  }                 
              };
              case ACCIONESSOLICITARLOA:                
                return{
                  ...state,
                  datosModal:{
                    expedientes: action.payload.data,
                    tituloModal: 'Expedientes que permiten solicitar LOA',
                    descripcion:'Utiliza los filtros para encontrar el expediente del que quieres solicitar LOA y pulsa sobre él.'
                  }                 
              };
              case ACCIONESSOLICITARLI:                
                return{
                  ...state,
                  datosModal:{
                    expedientes: action.payload.data,
                    tituloModal: 'Expedientes que permiten solicitar LI',
                    descripcion:'Utiliza los filtros para encontrar el expediente del que quieres solicitar LI y pulsa sobre él.'
                  }                 
              };
              case ACCIONESCONVERTIRDIGITAL:                
                return{
                  ...state,
                  datosModal:{
                    expedientes: action.payload.data,
                    tituloModal: 'Expedientes en papel no convertidos a digital',
                    descripcion:'Utiliza los filtros para encontrar el expediente en papel que quieres convertir a digital y pulsa sobre él.'
                  }                 
              };
              case ACCIONESCESAREXPEDIENTE:                
                return{
                  ...state,
                  datosModal:{
                    expedientes: action.payload.data,
                    tituloModal: 'Expedientes abiertos',
                    descripcion:'Utiliza los filtros para encontrar el expediente existente que quieres cerrar y pulsa sobre él.'
                  }                 
              };
              case FETCH_RESET_RESULT:
              return{
                ...state,
                datosModal:{
                  expedientes:[]
                }
              }
          
           
       
        case PURGE:
                        
              return initialstate; 
        default:
          return state;
    }
  };

 export default reducer;
