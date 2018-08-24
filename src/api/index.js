
 import {handleLoggout} from './../helpers/logout.js'

import ordertree from "../helpers/orderTree";
import axios from 'axios';
import * as types from './../actions/usuarios/types';
import {store} from './../index';


const BASE_PATH = "http://servicios.coag.es/api";

/*
*
*Configuración base para las llamadas axios
*
*/ 


const api = axios.create({
  baseURL: BASE_PATH,
  timeout: 10000,
  transformRequest: [function (data,headers) {
   
   
    // headers['Token'] = localStorage.getItem('token')||''
    //headers['Token'] =  store ? store.getState().user.token : localStorage.getItem('token')||''
    
   
    return JSON.stringify(data);
  }], 
   headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Token': localStorage.getItem('token')||''
  //     // // 'Token': store ? store.getState().user.token : '',
  }

  
});




  api.interceptors.response.use(function (response) {
    
    return response
  }, function (error) {
     
    const originalRequest = error.config
     
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true     
    
      //make refresh token request
      // return getToken()
      //   .then((response) => {
      //     console.log(response);
      //     console.log('Nuevo Token');
      //     console.log(response.headers.token);
      //     // set new oauth2 info
      //     // store.dispatch('userInfo/set', responseData.data)
      //     api.defaults.headers.common['Token'] = response.headers.token;
      //     originalRequest.headers['Token'] =  response.headers.token;
      //     //retry failed request
      //     console.log(originalRequest);
      //     return axios(originalRequest)
      //   }).catch(function (error) {
      //     console.log(error)
      //   })

      const retryOriginalRequest = new Promise((resolve) => {
        getToken().then(response => {
          if(response.headers.token){         
            originalRequest.headers['Token'] = response.headers.token;       
            resolve(api(originalRequest))
          }else{
            handleLoggout();
          }
        });       
      })
      return retryOriginalRequest
    }
   // handleLoggout();
    return Promise.reject(error)
  })
    //TODO:Aquí podriamos poner el manejo para en caso que ya sea un retry nos haga logout
 




/*
 *Proporciona la extructura documental de un trabajo
 * Parametros 
 *    id_expediente
 *    idtrabajo
 */
export const getEstructuraDocumental = (id_expediente,idtrabajo) =>
  api.get(`/EstructuraDocumental/${id_expediente}/${idtrabajo}`)
    .then(r=> {      
      return r;
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
      return response;
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
      return response;
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
      return response;
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
 *Proporciona expedientes de un usuario
 * Parametros 
 *    id_expediente
 */
export const expedientesuser = () =>
  api.get('/expedientes')
  
    .then(response => {
      console.log('expedientesuser')
      console.log(response)
      return response.data.Expedientes;
    }).catch((error)=>{

      console.log(error)
      // getToken();
      
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
    return response;

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
        Expediente: '688685',
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
      localStorage.setItem('token', response.headers.token);
     
    //  store.dispatch(fetchRefresh(response)).then( response=>{
    //    return response;
    //  });
     return response;
    }).catch(error => {
      handleLoggout()
        return error;
});
/*
 * Proporciona las acciones pendientes de un usuario
 * Parametros 
 *   Numero de acciones pendientes
*/  
export const getAcciones = () =>
    api.post('http://servicios.coag.es/api/AccionesPendientes/?Numero_Trabajos_acciones_pendientes=10',     
    )
    .then(response => {
     console.log(response);     
    //  store.dispatch(fetchRefresh(response)).then( response=>{
    //    return response;
    //  });
     return response;
    }).catch(error => {
     
        return error;
});


//FUNCION DUMMY para obtener los ultimos trabajos
export function getultimosTrabajos(){   
  let data =  {
    Trabajos: [
      {
        "Expediente_Codigo": "1801314",
        "Id_Trabajo": 5,
        "Antecedente": "",
        "Expediente_Codigo_estudio": "2018_C2",
        "Fecha_Entrada": "15/03/2018",
        "Fecha_Visado": "15/03/2018",
        "Titulo_Expediente": "Memoria",
        "Titulo": "Tramites",
        "Concello": "A Cañiza",
        "Promotor": "Colexio Oficial de Arquitectos de Galicia",
        "Estado": "Preentrega",
        "Id_Expediente": 702103,
        "Id_Objeto_Unico_WorkFlow": 987740,
        "Envio_Completo": 1,
        "Id_Estado": -1,
        "Ultima_Modificacion": "2018-03-12T11:31:45.44"
    },
    {
      "Expediente_Codigo": "1801312",
      "Id_Trabajo": 2,
      "Antecedente": "",
      "Expediente_Codigo_estudio": "2018_C1",
      "Fecha_Entrada": "12/03/2018",
      "Fecha_Visado": "12/03/2018",
      "Titulo_Expediente": " para sustitución de ventanas",
      "Titulo": "Pericias",
      "Concello": "SANTIAGO",
      "Promotor": "Colexio Oficial de Arquitectos de Galicia",
      "Estado": "Entregado",
      "Id_Expediente": 702003,
      "Id_Objeto_Unico_WorkFlow": 987740,
      "Envio_Completo": 1,
      "Id_Estado": -1,
      "Ultima_Modificacion": "2018-03-12T11:31:45.44",
      "acciones":"test"
  },
  {
    "Expediente_Codigo": "1801312",
    "Id_Trabajo": 2,
    "Antecedente": "",
    "Expediente_Codigo_estudio": "2018_C1",
    "Fecha_Entrada": "12/03/206",
    "Fecha_Visado": "11/03/2018",
    "Titulo_Expediente": "Memoria para sustitución de ventanas",
    "Titulo": "Pericias",
    "Concello": "SANTIAGO DE Chile",
    "Promotor": "Colexio Oficial de Arquitectos de Galicia",
    "Estado": "En trámite",
    "Id_Expediente": 702003,
    "Id_Objeto_Unico_WorkFlow": 987740,
    "Envio_Completo": 1,
    "Id_Estado": -1,
    "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": "Retenido",
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": "Tramitado",
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente de retirar",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Antecedente": "",
  "Expediente_Codigo_estudio": "2018_C2",
  "Fecha_Entrada": "15/03/2018",
  "Fecha_Visado": "15/03/2018",
  "Titulo_Expediente": "Memoria",
  "Titulo": "Tramites",
  "Concello": "A Cañiza",
  "Promotor": "Colexio Oficial de Arquitectos de Galicia",
  "Estado": "Pendiente",
  "Id_Expediente": 702103,
  "Id_Objeto_Unico_WorkFlow": 987740,
  "Envio_Completo": 1,
  "Id_Estado": -1,
  "Ultima_Modificacion": "2018-03-12T11:31:45.44"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/2018",
"Fecha_Visado": "12/03/2018",
"Titulo_Expediente": " para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44",
"acciones":"test"
},
{
"Expediente_Codigo": "1801312",
"Id_Trabajo": 2,
"Antecedente": "",
"Expediente_Codigo_estudio": "2018_C1",
"Fecha_Entrada": "12/03/206",
"Fecha_Visado": "11/03/2018",
"Titulo_Expediente": "Memoria para sustitución de ventanas",
"Titulo": "Pericias",
"Concello": "SANTIAGO DE Chile",
"Promotor": "Colexio Oficial de Arquitectos de Galicia",
"Estado": null,
"Id_Expediente": 702003,
"Id_Objeto_Unico_WorkFlow": 987740,
"Envio_Completo": 1,
"Id_Estado": -1,
"Ultima_Modificacion": "2018-03-12T11:31:45.44"
}
     
    ],   
  }
    return data;
}


//FUNCION DUMMY para obtener los ultimos trabajos
export function getExpedienteSuscepNuevoTrabajo(idUsuario){   
  let data =  {
    Expedientes: [
      {
        "Expediente_Codigo": "700043",
        "Id_Trabajo": 5,
        "Titulo": "Tramites",        
        "Fecha_Entrada": "12/03/2018",
        "Concello": "A Cañiza",
        "Emplazamiento": "Calle Rosal",       
        "Id_Expediente": 700043,
    },
    {
      "Expediente_Codigo": "1801314",
      "Id_Trabajo": 5,
      "Titulo": "Vivienda calle Rosal",        
      "Fecha_Entrada": "11/03/2018",
      "Concello": "A Cañiza",
      "Emplazamiento": "Calle Rosal",       
      "Id_Expediente": 696157,
  },
  {
    "Expediente_Codigo": "1801114",
    "Id_Trabajo": 2,
    "Titulo": "Viviendas en Gerona",        
    "Fecha_Entrada": "15/04/2018",
    "Concello": "A Cañiza",
    "Emplazamiento": "Calle Gerona",       
    "Id_Expediente": 695127,
},
{
  "Expediente_Codigo": "1801884",
  "Id_Trabajo": 3,
  "Titulo": "Viviendas en Vigo",        
  "Fecha_Entrada": "15/09/2018",
  "Concello": "A Cañiza",
  "Emplazamiento": "Calle Rosal",       
  "Id_Expediente": 702103,
},
{
  "Expediente_Codigo": "1801314",
  "Id_Trabajo": 5,
  "Titulo": "Tramites",        
  "Fecha_Entrada": "19/03/2018",
  "Concello": "A Cañiza",
  "Emplazamiento": "Calle Lerida",       
  "Id_Expediente": 702103,
},
  
     
    ],   
  }
    return data;
}

 /*
 *Busqueda de expedientes
 * Parametros 
 *    filtro
 */
export const getBuscador = (filtro,tipoBusqueda) =>

filtro==="" ? api.get(`/${tipoBusqueda}/`):api.get(`/${tipoBusqueda}/?filtro=${filtro}`)
  .then(response => {
    //let test=  store ? store.getState().user.token : ''
   
    console.log(response);
    return response;
  });


