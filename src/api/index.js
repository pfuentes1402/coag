import { handleLoggout } from './../helpers/logout.js'
import ordertree from "../helpers/orderTree";
import axios from 'axios';
import * as types from './../actions/usuarios/types';

const BASE_PATH = "http://servicios.coag.es/api";
/*
*
*Configuración base para las llamadas axios,
*se asegura que tenga el token, en caso de no tenerlo lo añade si este existe
*
*/
const api = axios.create({
  baseURL: BASE_PATH,
  timeout: 10000,
  header: {
    'Token': localStorage.getItem('token')
  },
  transformRequest: [function (data, headers) {

    return JSON.stringify(data);
  }],
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Token': localStorage.getItem('token') || ''
  }


});

api.interceptors.response.use(function (response) {

  return response
}, function (error) {

  const originalRequest = error.config

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true


    const retryOriginalRequest = new Promise((resolve) => {
      getToken().then(response => {
        if (response.headers.token) {
          originalRequest.headers['Token'] = response.headers.token;
          resolve(api(originalRequest))
        } else {
          handleLoggout();
        }
      });
    })
    return retryOriginalRequest
  }

  return Promise.reject(error)
})
//TODO:Aquí podriamos poner el manejo para en caso que ya sea un retry nos haga logout


/*
 *Proporciona la extructura documental de un trabajo
 * Parametros 
 *    id_expediente
 *    idtrabajo
 */
export const getEstructuraDocumental = (id_expediente, idtrabajo) =>
  api.get(`/EstructuraDocumental/${id_expediente}/${idtrabajo}`)
    .then(r => {
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


/**
 * Proporciona los grupos temáticos de un trabajo
 * @param id_grupo
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTiposTrabajo = (id_grupo, idLanguage=1) =>
  api.get(`/tipos/guia/grupostematicos/?id_tipo_grupo_raiz=${id_grupo}&idioma=${idLanguage}`).then(response => {
    return response;
  })
    .then(resultado => {
      return resultado;
});

/**
 * Proporciona los tipos de trámite de un trabajo
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTiposAutorizacionMunicipal = (idLanguage = 2) =>
  api.get(`/Tipos/Guia/Tiposautorizacionmunicipal/?idioma=${idLanguage}`)
    .then(response => {
      return response;
    })
    .then(resultado => {
      return resultado;
    });

/**
 * Proporciona los tipos de trabajos permitidos de un tipo de obra y tipo de tramite
 * @param id_tipo_grupo
 * @param id_tipo_autorizacion
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getFasesTrabajos = (id_tipo_grupo, id_tipo_autorizacion, idLanguage = 2) =>
  api.get(`/Tipos/Guia/Fasestrabajos/?id_tipo_grupo_tematico=${id_tipo_grupo}&id_tipo_autorizacion_municipal=${id_tipo_autorizacion}&idioma=${idLanguage}`)
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
export const getValidateAddress = async ref_catastral => {
    let response = await api.get(`/DatosCatastro/${ref_catastral}`);
    return response;
}


/*
 *Graba un nuevo expediente
 * Parametros
 *    data->Datos que conforman un nuevo expediente
*/
export const postNuevoExpediente = data => {
  return new Promise((success, error) => {
    api.post(`/expedientes/`, data)
      .then(resultado => {
        success(resultado)
      }).catch(function (e) {
        console.log(e.response.data.Message)
      });
  })
}
/*
 *Edita un expediente expediente
 * Parametros 
 *    data->Datos que conforman  el expediente
*/
export const putExpediente = (data) =>
  api.put(`${BASE_PATH}/expedientes/`).then(
    v => v.json()).then(resultado => {
      return resultado;
    });

/*
 *Edita un expediente expediente
 * Parametros 
 *    data->Datos que conforman  el expediente
*/
export function getAgentesInfo(id_Agente) {
  let data = {
    Arquitectos: [
      {
        nif: '76900827M',
        nombre: 'Pedro Martinez',
        porcentage: '60%',
      },
      {
        nif: '35782595X',
        nombre: 'Martin Alvarez Salgado',
        porcentage: '20%',
      }
    ],
    Promotores: [
      {
        nif: '3578245544T',
        nombre: 'Joaquin Perez Salgado',
        porcentage: '10%',
      },
      {
        nif: '233444266H',
        nombre: 'Juan Alvarez Sousa',
        porcentage: '10%',
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

      return response.json();
    })
    .then(resultado => {

      return resultado;
    });

/*
 *Proporciona los trabajos de un expediente
 * Parametros 
 *    id_expediente
 */
export const GettrabajosExpediente = (id_expediente) =>
  api.get(`/expedientes/${id_expediente}/trabajos/`)

    .then(response => {
      return response.data.Trabajos;
    }).catch((error) => {
    });
/*
 *Proporciona expedientes de un usuario
 * Parametros 
 *    id_expediente
 */
export const expedientesuser = () =>
  api.get('/expedientes')

    .then(response => {
      return response.data.Expedientes;
    }).catch((error) => {
    });



/*
*Proporciona los datos generales de un Trabajo
* Parametros 
*    id_expediente
*    id_Trabajo
*/
export const getTrabajoeDatosGenerales = (id_expediente, id_Trabajo) =>
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
  api.post('/login', { Usuario: datos.usuario, password: datos.password }).then(response => {
    return response;
  }).catch(error => {
    //errorLogin(error);
    return error.response.status;
  });

/*
 * Proporciona un token de autorización necesario para autentificar las peticiones API
 * Parametros 
 *    Recoge ClienteId y ClienteClave del localStorage del navegador
*/
export const getToken = () =>
  axios.post('http://servicios.coag.es/api/authenticate',
    {
      ClienteId: localStorage.getItem('clienteid'),
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
  api.post('http://servicios.coag.es/api/AccionesPendientes/',
  )
    .then(response => {

      //  store.dispatch(fetchRefresh(response)).then( response=>{
      //    return response;
      //  });
      return response;
    }).catch(error => {

      return error;
    });
/*
 *obtiene las acciones pendientes(todas), luego las pagina el componente 
 */

export const getultimosTrabajos = () =>
  api.get('AccionesPendientes/')
    .then(response => {
      //let test=  store ? store.getState().user.token : ''

      return response;
    });

//FUNCION DUMMY para obtener los susceptibles de acciones
export function getExpedienteSuscepNuevoTrabajo(idUsuario) {
  let data = {
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

/**
 * Busqueda de expedientes
 * @param filtro
 * @param tipoBusqueda
 * @returns {any}
 */
export const getBuscador = (filtro, tipoBusqueda) =>
  filtro === "" ? api.get(`/${tipoBusqueda}/`) : api.get(`/${tipoBusqueda}/?filtro=${filtro}`)
    .then(response => {
      //let test=  store ? store.getState().user.token : ''
      return response;
    });

/**
 * Proporciona la estructura documental de un trabajo
 * @param idExpediente
 * @param idTrabajo
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getestructuradocumental = (idExpediente, idTrabajo) =>
  api.get(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumental`)
    .then(response => {
      return response.data;
    });


/**
 * Proporciona la lista de grupos raiz
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getGruposRaiz = (idLanguage = 2) =>
  api.get(`/tipos/guia/gruposraiz?idioma=${idLanguage}`)
      .then(response => {
  return response;
});

/**
 * Inserta un trabajo encomenda (comunicacion de encargo) para un expediente
 * @param data object {
 *           "Id_Tipo_Grupo_Tematico": 1,
 *           "Id_Tipo_Autorizacion_Municipal":1,
 *           "Id_Tipo_Fase":1,
 *           "Id_Tipo_Trabajo":219,
 *           "Id_Tipo_Tramite":2,
 *
 *           "Colegiados": [
 *             {   "Id_Colegiado":2853,
 *                "Id_Tipo_Colegiado":1,
 *                "Id_Sociedad":0,
 *                "Porcentaje": 10,
 *                "Ids_Funciones":"31,30",
 *                "PorcentajesEquitativos": 1
 *                     	}
 *
 *                     	],
 *            "Promotores"	:[
 *               {"id_entidad": -1,
 *                 "Nif":"36110129H",
 *                 "Id_Tipo_Entidad":1,
 *                 "Id_Tipo_Encargante":3,
 *                 "Nombre": "Manolo",
 *                 "Apellido1":"Cadenas",
 *                 "Apellido2":"",
 *                 "Observaciones":null,
 *                 "Id_Tipo_Organismo": null,
 *                 "Mail":"cadenas@gamil.com",
 *                 "Telefono":null,
 *                  "Calle":"Gran vía",
 *                 "Numero":null,
 *                 "Piso":null,
 *                 "Codigo_Postal" :null,
 *                 "Id_Concello":36057,
 *                 "PorcentajesEquitativos": 1
 *             	}  	],
 *             "IgnorarObservaciones":1
 *             }
 * @param id_expediente
 * @returns {Promise}
 */
export const insertTrabajoEncomenda = (data, id_expediente) => {
    return new Promise((success, error) => {
        api.post(`/expedientes/${id_expediente}/trabajos/`, data)
            .then(resultado => {
                success(resultado)
            }).catch(function (e) {
            console.log(e.response.data.message)
        });
    })
};

/**Todas las Funciones compatibles con la tipologia en agentes(Arquitectos)*/
export const getFuncionesTipologia = (idLanguage = 1) =>
  api.get(`/tipos/guia/funciones?idioma=${idLanguage}`).then(response => {
    return response;
  });

/**Agregar nuevos agentes a un trabajo */
export const addAgentesTrabajo = (idExpediente, idTrabajo, otrosAgentes) =>
  api.post(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/otrosagentes/`,{ OtrosAgentes: otrosAgentes })
    .then(response => {
      return response;
    }).catch(error => {
      console.log("ERROR", error);
      return 403;
    });