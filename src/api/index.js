import store from './../index'

import ordertree from "../helpers/orderTree";
import axios from 'axios';
import * as types from './../actions/usuarios/types';


const BASE_PATH = "http://servicios.coag.es/api";

// store.subscribe(listener)

// function select(state) {
//   return state.user.Token;
// }
// function listener() {
//   let token = select(store.getState())
  
// }


/*
*
*Configuración base para las llamadas axios
*
*/
const api = axios.create({
  baseURL: BASE_PATH,
  timeout: 10000,
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Token': localStorage.getItem('token'),
  }
});



/*
 *Proporciona la extructura documental de un trabajo
 * Parametros 
 *    id_expediente
 *    idtrabajo
 */
export const getEstructuraDocumental = (id_expediente,idtrabajo) =>
  api.get(`/EstructuraDocumental/${id_expediente}/${idtrabajo}`)
    .then(r=> {
      return r.json();
    })
    .then(resultado => {
      let ordenado = ordertree(resultado);
      return ordenado;
    });



/*
 *Proporciona los datos generales de un expediente
 * Parametros 
 *    id_expediente
 */
export const getExpedienteDatosGeneral = id_expediente =>
  api.get(`/expedientes/${id_expediente}`).then(response => {
    return response;
  });

        

/*
 *Proporciona los grupos temáticos de un trabajo
 * Parametros 
 *    id_grupo
 */
export const getTiposTrabajo = id_grupo =>
  api.get(`/Tipos/Guia/GruposTematicos/${id_grupo}`).then(response => {
      return response.json();
    })
    .then(resultado => {
      return resultado;
    });



/*
 *Proporciona los tipos de trámite de un trabajo
 */
export const getTiposAutorizacionMunicipal = () =>
  api.get(`/Tipos/Guia/Tiposautorizacionmunicipal/`)
    .then(response => {
      return response.json();
    })
    .then(resultado => {
      return resultado;
    });



/*
 *Proporciona los tipos de trabajos permitidos de un tipo de obra y tipo de tramite
 */
export const getFasesTrabajos = (id_tipo_grupo, id_tipo_autorizacion) =>
  api.get(`/Tipos/Guia/Fasestrabajos/?id_tipo_grupo_tematico=${id_tipo_grupo}&id_tipo_autorizacion_municipal=${id_tipo_autorizacion}&idioma=1`)
    .then(response => {
      return response.json();
    })
    .then(resultado => {
      return resultado;
    });



/*
 *Valida una dirección a traves de su referencia catastral
 * Parametros 
 *    ref_catastral
 */
export const getValidateAddress = ref_catastral =>
  api.get(`/DatosCatastro/${ref_catastral}`).then(response => {
      return response;
    });



/*
 *Graba un nuevo expediente
 * Parametros 
 *    data->Datos que conforman un nuevo expediente
*/
export const postNuevoExpediente = data =>
    api.post(`/expedientes/`).then(v => v.json())
      .then(resultado => {     
        return resultado;
      });



/*
 *Edita un expediente expediente
 * Parametros 
 *    data->Datos que conforman  el expediente
*/
 export const putExpediente = (data)=>
  api.put(`${BASE_PATH}/expedientes/`).then(
    v => v.json()).then(resultado => {
            return resultado;
          });



/*
 *Edita un expediente expediente
 * Parametros 
 *    data->Datos que conforman  el expediente
*/
export function getAgentesInfo(id_Agente){
    let data =  {
      Arquitectos: [
        {
          nif: '76900827M',
          nombre: 'Pedro Martinez',
          porcentage: '60%',
        },
        {
          nif: '35782595X',
          nombre: 'Martin Alvarez Salgado',
          porcentage:  '20%',
        }
      ],
      Promotores: [
        {
          nif: '3578245544T',
          nombre: 'Joaquin Perez Salgado',
          porcentage:  '10%',
        },
        {
          nif: '233444266H',
          nombre: 'Juan Alvarez Sousa',
          porcentage:  '10%',
        }
      ]
    }
  return data;
}



/*
 *Proporciona los datos generales de un expediente
 * Parametros 
 *    id_expediente
 */
export const test = id_expediente =>
  api.get(`/expedientes/${id_expediente}`)
    .then(response => {
    console.log('respuesta');
    console.log(response);
      return response.json();
    })
    .then(resultado => {
          
      return resultado;
    });



  /*
 *Proporciona los datos generales de un Trabajo
 * Parametros 
 *    id_expediente
 *    id_Trabajo
 */
export const getTrabajoeDatosGenerales = (id_expediente,id_Trabajo) =>
api.get(`/expedientes/${id_expediente}/trabajos/${id_Trabajo}`)
  .then(response => {
   console.log('getTrabajoeDatosGenerales api');
   console.log(response);
    return response.json();

  })
  .then(resultado => {
      
    return resultado;
  });

  export const errorLogin = (data) => (  
   
    {
        
    type: types.FETCH_LOGIN_FAIL,
    payload: data
});





/*
 *  Función que loguea a un usuario y consigue identificadores únicos para la generación del token
 *  Parametros 
 *    usuario
 *    password
 */
export const funcionForma = (datos) => 
  api.post('/login', {Usuario: datos.usuario, password: datos.password}).then(response => {      
      return response;
    }).catch(error => {
      //errorLogin(error);
      return error.response.status;
    });



//FUNCION DUMMY
 export function getDatosUsuario(id){   
  let data =  {
    Expedientes: [
      {
        Expediente: '688685 ',
        fecha: '05/06/2018',       
      },
      {
        Expediente: '683180',
        fecha: '05/06/2018',       
      },
      {
        Expediente: '685062',
        fecha: '05/06/2018',       
      },
      {
        Expediente: '693458',
        fecha: '05/06/2018',       
      },
    ],   
  }
    return data;
}

 

/*
 * Proporciona un token de autorización necesario para autentificar las peticiones API
 * Parametros 
 *    Recoge ClienteId y ClienteClave del localStorage del navegador
*/  
export const getToken = () =>
    axios.post('http://servicios.coag.es/api/authenticate',     
    {ClienteId: localStorage.getItem('clienteid'),
    ClienteClave: localStorage.getItem('clienteclave')
    })
    .then(response => {
      return response;
    }).catch(error => {
        return error.response.status;
});
