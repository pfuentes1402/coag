import { handleLoggout } from './../helpers/logout.js'
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
  timeout: 60000,
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
api.interceptors.request.use(async function (request) {
    request.headers['Token']= await localStorage.getItem('token') || '';
    return request
})

api.interceptors.response.use(function (response) {
  return response
}, function (error) {

  const originalRequest = error.config

  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true


    const retryOriginalRequest = new Promise(async (resolve) => {
      await getToken().then(response => {
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
/*
 *Proporciona los datos generales de un expediente
 * Parametros 
 *    id_expediente
 */
export const getExpedienteDatosGeneral = async (id_expediente) => {
  try {
    let response = await api.get(`/expedientes/${id_expediente}`);
    return response;
  }
  catch (error) {
    return error;
  }
}


/**
 * Proporciona los grupos temáticos de un trabajo
 * @param id_grupo
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTiposTrabajo = (id_grupo, idLanguage = 1) =>
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
export const getFasesTrabajos = async (id_tipo_grupo, id_tipo_autorizacion, idLanguage = 2) => {
  try {
    let response = await api.get(`/Tipos/Guia/Fasestrabajos/?id_tipo_grupo_tematico=${id_tipo_grupo}&id_tipo_autorizacion_municipal=${id_tipo_autorizacion}&idioma=${idLanguage}`);
    return response;
  }
  catch (error) {
    return formatMenssage(error.message);
  }
}
/**
 * Obtiene los tipos de tramites
 * @param idLanguage
 * @returns {Promise<*>}
 */
export const getTiposTramite = async (idLanguage = 2) => {
  try {
    let response = await api.get(`/tipos/guia/tramites/?idioma=${idLanguage}`);
    return response.data;
  }
  catch (error) {
    return formatMenssage(error.message);
  }
}


/*
 *Valida una dirección a traves de su referencia catastral
 * Parametros
 *    ref_catastral
 */
export const getValidateAddress = async ref_catastral => {
  try {
    let response = await api.get(`/DatosCatastro/${ref_catastral}`);
    return response.data;
  }
  catch (error) {
    return formatMenssage(error.message);
  }
}

/**
 * Inserta un nuevo expediente
 * @param data
 * @returns {Promise<*>}
 */
export const postNuevoExpediente = async data => {
  try {
    let response = await api.post(`/expedientes/`, data);

    return response.data;
  }
  catch (error) {
    return formatMenssage(error.message);
  }
}
/*
 *Edita un expediente expediente
 * Parametros 
 *    data->Datos que conforman  el expediente
*/
export const putExpediente = async (data) => {
  try {
    let response = await api.put(`/expedientes/${data.Id_Expediente}`, data);
    return response;
  }
  catch (error) {
    return error;
  }
}

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
export const expedientesuser = async () => {
    try {
        let response = await api.get('/expedientes');
        return response.data;
    } catch (error) {
        return formatMenssage(error.message);
    }
}


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


/* TODO: Login paso 2
 *  Función que loguea a un usuario y consigue identificadores únicos para la generación del token
 *  Parametros 
 *    usuario
 *    password
 */
/*export const funcionForma = (datos) =>
  api.post('/login', { Usuario: datos.usuario, password: datos.password }).then(response => {
    return response;
  }).catch(error => {
    //errorLogin(error);
    return error.response.status;
  });*/
export const funcionForma = async (datos) => {
  try {
      let response = await api.post('/login', { Usuario: datos.usuario, password: datos.password });
      return response;
  }
  catch (error) {
      return formatMenssage(error.message);
  }
}

/*
 * Proporciona un token de autorización necesario para autentificar las peticiones API
 * Parametros 
 *    Recoge ClienteId y ClienteClave del localStorage del navegador
*/
export const getToken = async () => {
  try {
      let clienteId = await localStorage.getItem('clienteid') ;
      let clienteClave = await localStorage.getItem('clienteclave') ;
      let response = await axios.post('http://servicios.coag.es/api/authenticate',
          {
              ClienteId: clienteId,
              ClienteClave: clienteClave
          });
      console.log(response.headers)
      await localStorage.setItem('token', response.headers.token);
      return response;
  }catch (error) {
      handleLoggout();
      formatMenssage(error.message);
  }
}

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
export const getultimosTrabajos = async () => {
    try {
        let response = await api.get('/AccionesPendientes/');
        return response.data;
    }
    catch (error) {
        return formatMenssage(error.message);
    }
}

/**
 * Obtiene los expedientes en dependencia de la accion expecificada
 * @param filtro
 * @param idAccion
 * 1- Modificar datos
 * 2 - Nuevo Trabajo
 * 3 - Libro de Ordenes
 * 4 - Libro de Incidencias
 * 5 - Convertir exp. a digital
 * 6 - Ceses
 * @param page
 * @param pageSize
 * @returns {Promise<*>}
 */
export const getExpedienteSuscepNuevoTrabajo = async(filtro, idAccion, page = 1, pageSize = 25) => {
    try {
        let response = await api.get(`/expedientes?filtro=${filtro}&pag=${page}&tam=${pageSize}&id_tipo_accion=${idAccion}`);
        return response.data;
    }
    catch (e) {
        return formatMenssage(e.message);
    }
}

export const postExpedienteAccion = async(id_expediente, idAccion, ignorarObservaciones) => {
    try {
        let response = await api.post(`/expedientes/${id_expediente}/Accion?id_tipo_accion=${idAccion}&ignorarobservaciones=${ignorarObservaciones}`);
        return response.data;
    }
    catch (e) {
        return formatMenssage(e.message);
    }
}

/**
 * Busqueda de expedientes
 * @param filtro
 * @param tipoBusqueda
 * @returns {any}
 */
export const getBuscador = async (filtro, tipoBusqueda, page = 1, pageSize = 25) => {
  try {
    let uri = filtro === "" ? `/${tipoBusqueda}/?pag=${page}&tam=${pageSize}` : `/${tipoBusqueda}/?filtro=${filtro}&pag=${page}&tam=${pageSize}`;
    //let response = await fetchData(uri,{})
    let response = await api.get(uri);
    return response;
  } catch (error) {
    return error
  }
}

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
 * @param object
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
export const getFuncionesTipologia = (idLanguage = 2, idGrupoTematico = 0, idAutorizacionMunicipal = 0) =>
  api.get(`/tipos/guia/funciones?idioma=${idLanguage}&id_tipo_grupo_tematico=${idGrupoTematico}&id_tipo_autorizacion_municipal=${idAutorizacionMunicipal}`)
    .then(response => {
      return response;
    });

/**Agregar nuevos agentes a un trabajo */
export const addAgentesTrabajo = (idExpediente, idTrabajo, otrosAgentes) =>
  api.post(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/otrosagentes/`, { OtrosAgentes: otrosAgentes })
    .then(response => {
      return response;
    }).catch(error => {
      console.log("ERROR", error);
      return 403;
    });

/**
 * Proporciona la lista de paises
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getPaises = async (idLanguage = 2) => {
  try {
    let response = await api.get(`/tipos/paises?idioma=${idLanguage}`);
    return response;
  } catch (error) {
    return error;
  }
}
/**
 * Proporciona la lista de regiones autonomas
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getRegionesAutonoma = async (idLanguage = 2) => {
  try {
    let response = await api.get(`/tipos/autonomias?idioma=${idLanguage}`)
    return response;
  } catch (error) {
    return error;
  }
}

/**
 * Proporcina la lista de provincias de una region
 * @param idAutonomia identificador de la region autonoma
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getProvincias = async (idAutonomia, idLanguage = 2) => {
  try {
    let response = await api.get(`/tipos/provincias?id_autonomia=${idAutonomia}&idioma=${idLanguage}`)
    return response;
  } catch (error) {
    return error;
  }
}

/**
 * Proporciona la lista de municipios o concellos de una provincia
 * @param idProvincia identificador de la provincia
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getConcellos = async (id_provincia, idLanguage = 2) => {
  try {
    let response = await api.get(`/tipos/Concellos?id_provincia=${id_provincia}&idioma=${idLanguage}`)
    return response;
  } catch (error) {
    return error;
  }
}

/**
 * Proporciona lista de tipos de promotores
 * @param idLanguage
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTipoPromotores = async (idLanguage = 2) => {
  try {
    let response = await api.get(`/tipos/tipos_promotores?idioma=${idLanguage}`)
    return response;
  } catch (error) {
    return error;
  }
}

/**
 * Proporciona lista de tipos de Organismos
 * @param idLanguage
 * @returns {Promise<*>}
 */
export const getTipoOrganismoa = async (idLanguage = 2) => {
  try {
    let response = await api.get(`/tipos/tipos_organismos?idioma=${idLanguage}`)
    return response;
  } catch (error) {
    return error;
  }
}
/**
 * Permite insertar un trabajo a un expediente existente
 * @param idExpediente
 * @param dataPost
 * @returns {Promise<*>}
 */
export const addTrabajoEncomendaExpediente = async (idExpediente, dataPost) => {
  try {
    let response = await api.post(`/expedientes/${idExpediente}/trabajos/`, dataPost)
    return response.data;
  }
  catch (error) {
    return error;
  }
}

/**
 * Actualizar emplazamientos dentro de un expediente
 * @param {*} data 
 */
export const putEmplazamiento = async (idExpediente, data) => {
  try {
    let response = await api.put(`/expedientes/${idExpediente}/emplazamientos`, data);
    return response;
  }
  catch (error) {
    return error;
  }
}

/**
 * Función para manejar los colegiados (Agentes o Arquitectos) dentro de un trabajo
 * de un expediente
 * @param {*Expediente en cuestion} idExpediente
 * @param {*Trabajo dentro del expediente} idTrabajo
 * @param {*Accion a realizar [POST, PUT, DELETE]} verb
 * @param {*Datos a enviar} data
 */
export const manageColegiados = async (idExpediente, idTrabajo, verb, data) => {
  try {
    let response = {};
    switch (verb) {
      case "POST":
        response = api.post(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/colegiados/`, data);
        break;

      case "PUT":
        response = api.put(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/colegiados/`, data);
        break;

      case "DELETE":
        response = api.delete(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/colegiados/${data}`);
        break;
      default:
        return null
    }
    return response;
  }
  catch (error) {
    return error;
  }
}

/** Seccion de promotores **/
/**
 * Obtiene los colegioados dado el expediente expecificado por idExpediente y el trabajo correspondiente al idTrabajo
 * @param idExpediente
 * @param idTrabajo
 * @returns {Promise<*>}
 */
export const getColegiados = async (idExpediente, idTrabajo) => {
  try {
    let response = await api.get(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/promotores/`);
    return response;
  }
  catch (error) {
    return error;
  }
}
/**
 * Inserta los promotores dado el expediente expecificado por idExpediente y el trabajo correspondiente al idTrabajo
 * @param idExpediente
 * @param idTrabajo
 * @param data
 * @returns {Promise<*>}
 */
export const postColegiados = async (idExpediente, idTrabajo, data) => {
  try {
    let response = await api.post(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/promotores/`, data);
    return response;
  }
  catch (error) {
    return error;
  }
}

/**
 * Delete el promotores expecificado en el idColegiado en el expediente expecificado por idExpediente y el trabajo correspondiente al idTrabajo
 * @param idExpediente
 * @param idTrabajo
 * @param idColegiado
 * @returns {Promise<*>}
 */
export const deleteColegiados = async (idExpediente, idTrabajo, idColegiado) => {
  try {
    let response = await api.delete(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/promotores/${idColegiado}`);
    return response;
  }
  catch (error) {
    return error;
  }
}

/**
 * Actualiza los promotores dado el expediente expecificado por idExpediente y el trabajo correspondiente al idTrabajo
 * @param idExpediente
 * @param idTrabajo
 * @param data
 * @returns {Promise<*>}
 */
export const putColegiados = async (idExpediente, idTrabajo, data) => {
  try {
    let response = await api.put(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/promotores/`, data);
    return response;
  }
  catch (error) {
    return error;
  }
}

/**
 * Obtiene los datos de la encomenda actual
 * @param {*} idExpediente 
 * @param {*} languageId 
 */
export const fetchEncomendaActual = async (idExpediente, languageId = 2) => {
  try {
    let response = await api.get(`/expedientes/${idExpediente}/EncomendaActual?idioma=${languageId}`);
    return response;
  }
  catch (error) {
    return formatMenssage(error.message);
  }
}
/**
 * Obtiene informacion del expediente con la encomenda actual
 * @param idExpediente
 * @param datapost
 * @param languageId
 * @returns {Promise<*>}
 */
export const manageEncomenda = async (idExpediente, datapost, languageId = 2) => {
  try {
    let response = await api.post(`/expedientes/${idExpediente}/trabajos/EncomendayOtros?idioma=${languageId}`, datapost);
    return response;
  }
  catch (error) {
    return formatMenssage(error.message);
  }
}

/**
 * Obtiene la estructura de carpetas de un tipo de trabajo
 * @param id_tipo_trabajo
 * @param id_tipo_tramite
 * @param es_modificado
 * @param languageId
 * @returns {Promise<*>}
 */
export const infoCarpetasTrabajo = async (id_tipo_trabajo, id_tipo_tramite, es_modificado, languageId = 2) => {
    try {
        let response = await api.get(`/tipos/guia/infocarpetasdetrabajo/?id_tipo_trabajo=${id_tipo_trabajo}&id_tipo_tramite=${id_tipo_tramite}&es_modificado=${es_modificado}&idioma=${languageId}`);
        return response.data;
    }
    catch (error) {
        return formatMenssage(error.message);
    }
}

export const getEstructuraDocumental = async (id_expediente, id_trabajo, languageId = 2) => {
    try {
        let response = await api.get(`/expedientes/${id_expediente}/trabajos/${id_trabajo}/estructuradocumental?idioma=${languageId}`);
        return response.data;
    }
    catch (error) {
        return formatMenssage(error.message);
    }
}

export const formatMenssage = (error) => (
  {
    "MensajesProcesado": [{ "Mensaje": error }]
  }
)
/**
 * Sección de docuemntos de un expediente
 */

export const getAllFiles = async (idExpediente, idTrabajo, lang = 1) => {
    try {
        let response = await api.get(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumental?idioma=${lang}`);
        return response.data;
    } catch (error) {
        return formatMenssage(error.message);
    }
}

//obtener todos los archivos de una carpeta
export const getFilesFromFolder = async (idExpediente, idTrabajo, folderId, lang = 1) => {
    try {
        let response = await api.get(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumental/${folderId}/archivos?idioma=${lang}`);
        return response;
    } catch (error) {
        return formatMenssage(error.message);
    }
}
//obtener los detalles de una carpeta
export const getFolderDetails = async (idExpediente, idTrabajo, folderId, lang = 1) => {
    try {
        let response = await api.get(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumentalinfocarpeta/${folderId}?idioma=${lang}`);
        return response;
    } catch (error) {
        return formatMenssage(error.message);
    }
}

/**
 * Obtiene los detalles de un archivo
 * @param idExpediente
 * @param idTrabajo
 * @param idEstructura id de la estructura de un archivo
 * @returns {Promise<*>}
 */
export const getDetallesArchivo = async (idExpediente, idTrabajo, idEstructura) => {
    try {
        let response = await api.get(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/Estructuradocumental/${idEstructura}?Detalle_archivo=1`);
        return response.data;
    } catch (error) {
        return formatMenssage(error.message);
    }
}
//obtener los detalles de un trabajo
export const getWorkDetails = async (idExpediente, idTrabajo, lang = 1) => {
    try {
        let response = await api.get(`/expedientes/${idExpediente}/trabajos/${idTrabajo}?idioma=${lang}`);
        return response;
    } catch (error) {
        return formatMenssage(error.message);
    }
}

//Subir un fichero a una carpeta
export const uploadFile = async (idExpediente, idTrabajo, folderId, file) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data = new FormData();
            data.append('file', file.data);
            data.append('filename', file.filename)

            let result = await axios.post(BASE_PATH + `/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumental/${folderId}/archivos`, data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Token': localStorage.getItem('token'),
                    }


                }
            );
            resolve(result.data)
        } catch (error) {
            return(formatMenssage(error.message));
        }

    })

}

//subir fichero a carpeta temporal
export const uploadFileToTemporalFolder = async (idExpediente,   file) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = new FormData();
            data.append('file', file.data);
            data.append('filename', file.filename)
            let result = await axios.post(BASE_PATH + `/expedientes/${idExpediente}/AlmacenTemporalArchivos`, data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Token': localStorage.getItem('token'),
                    }


                }
            );
            resolve(result.data)
        } catch (error) {
            reject(formatMenssage(error.message));
        }

    })
}
//Leer la carpeta temporal

export const getFilesFromTemporalFolder = async (idExpediente, lang = 1) => {
    try {

        let response = await api.get(`/expedientes/${idExpediente}/AlmacenTemporalArchivos?idioma=${lang}`);
        return response.data;
    } catch (error) {
        return formatMenssage(error.message);
    }
}
//mover un arivo desde la carpeta temporal a una estructura
export const moveFileFromTemporalToStructure = async (idExpediente, idTrabajo, folderId, file) => {
    try {
      let result = await api.post(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumental/${folderId}/archivosdesdealmacentemporal`, {Nombre:file});
      return result.data
    } catch (error ) {
      return formatMenssage("Error 400")
    }
}
//eliminar multiples archivos de la carpeta temporal
export const removeFilesFromTemporalFolder = async (idExpediente,  arrayFiles) => {
  try {
    let result = await api.delete(`/expedientes/${idExpediente}/AlmacenTemporalArchivos`, {data:{Archivos:arrayFiles}});
    return result.data
  } catch (error ) {
      return formatMenssage("Error 400")
  }
}
//eliminar un archivo de una estructura
export const removeFileFromStructure = async (idExpediente, idTrabajo, folderId) => {
  try {
    let result = await api.delete(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumental/${folderId}`, {ignorarobservaciones:1});
    return result.data
  } catch (error ) {
      return formatMenssage("Error 400")
  }
}
//Eliminar multiples archivos de una estructura
export const removeMultipleFilesFromStructure = async (idExpediente, idTrabajo, arrayArchivos) => {
  try {
    let url = `/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumental/archivos`
    let result = await api.delete(url,
        {data:{ Archivos:arrayArchivos,

            ignorarobservaciones:1}

        });
    return result.data
  } catch (error ) {
    return formatMenssage("Error 400")
  }
}

//Asignación automática de archivos
export const autoAsignFilesFromTemporalFiles = async (idExpediente, idTrabajo, file) => {
  try {
    let result = await api.post(`/expedientes/${idExpediente}/AlmacenTemporalArchivos/AsignacionAutomatica`,
        {
          Id_Trabajo:idTrabajo,
          Archivos:file,
          InsertarArchivos:1
        }
        );
    return result.data
  } catch (error ) {
    return formatMenssage("Error 400")
  }
}
//Obtener Url de Descarga de archivos En carpetas
export const getUrlDownladFiles = async (idExpediente, idTrabajo,archivos) => {
  try {

    let arc= archivos;
    let result = await api.get(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumental/InfoArchivoDescarga`,
        {
          Archivos:archivos
        }
    );
    return result.data
  } catch (error ) {
    return formatMenssage("Error 400")
  }
}
export const getUrlDownladFilesTempFolder = async (idExpediente, archivos) => {
    try {


        let result = await api.get(`/expedientes/${idExpediente}/almacentemporalarchivos/InfoArchivoDescarga`,
            {
                Archivos:archivos
            }
        );
        return result.data
    } catch (error ) {
        return formatMenssage(`Error 404`)
    }
}

//Obtener Url de Descarga de 1 archivo
export const getUrlDownladOneFile = async (idExpediente, idTrabajo,archivo) => {
    try {


        let result = await api.get(`/expedientes/${idExpediente}/trabajos/${idTrabajo}/estructuradocumental/${archivo}/InfoArchivoDescarga`
        );
        return result.data
    } catch (error ) {
        return formatMenssage("Error 404")
    }
}
export const download=async (urlFile,fileName)=>{
    let response =await  axios.get(urlFile,{
        responseType:'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

}


/**Obtener los tipos de autorización municipal segun el grupo
 * temático seleccionado
 */
export const getAutorizacionMunicipal = async (grupoTematico, languageId = 1) => {
  try {
    let result = await api.get(`/tipos/guia/tiposautorizacionmunicipal?idioma=${languageId}&id_tipo_grupo_tematico=${grupoTematico}`);
    return result.data;
  }
  catch (error) {
    return formatMenssage(error.message);
  }
}
