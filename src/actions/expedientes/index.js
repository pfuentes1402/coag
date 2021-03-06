import {
    getEstructuraDocumental, getValidateAddress, postNuevoExpediente, getExpedienteDatosGeneral,
    getTrabajoeDatosGenerales, getAgentesInfo, expedientesuser, getAcciones, getBuscador,
    GettrabajosExpediente, addTrabajoEncomendaExpediente
} from '../../api';

import * as types from './types';
import * as api from "../../api";

export const formatMenssage = (error) => (
    {
        "MensajesProcesado": [{ "Mensaje": error }]
    }
)

export const fetchInit = () => ({
    type: types.FETCH_EXPEDIENTES_INIT
});

export const fetchSuccess = (expedientes) => ({
    type: types.FETCH_EXPEDIENTES_SUCCESS,
    payload: expedientes
});


export const fetchSuccessTrabajo = (expedientes) => ({
    type: types.FETCH_DATAFORTREETRABAJO_SUCCESS,
    payload: expedientes
});

export const fetchSuccesExpediente = (data) => ({
    type: types.FETCH_EXPEDIENTE_SUCCESS_EXP,
    payload: data
});
export const fetchSuccesTrabajosExpediente = (data) => ({
    type: types.FETCH_EXPEDIENTE_TRABAJOS_EXP,
    payload: data
});

export const fetchErrorExpediente = (error) => ({
    type: types.FETCH_EXPEDIENTES_ERROR,
    payload: error
});

export const fetchAddress = (response) => ({
    type: types.FETCH_UBICACION_SUCCESS,
    payload: response
});

export const fetchUpdateAddress = (response) => ({
    type: types.FETCH_UBICACION_UPDATE,
    payload: response
});

export const fetchExpedientSave = (response) => ({
    type: types.FETCH_EXPEDIENTSAVE_TO_STORE,
    payload: response
});
export const fetchExpedienteSelected = (response) => ({
    type: types.FETCH_SAVE_SELECTED_EXP_TO_STORE,
    payload: response
});
export const resetUpladStates = (typeUpload) =>
    async (dispatch) => {
        dispatch(fetchFiles(false, [], 0, typeUpload,null, null, true));
    };
export const fetchFiles = (uploadInProgress, pendingUploadList, uploadLength,typeUpload ,currentUpload = null, currentUploadItem = null, fetchingDone = false, ) => (
    {
        type: types.FETCH_FILES,
        payload: { uploadInProgress, pendingUploadList, uploadLength, currentUpload, currentUploadItem, fetchingDone,typeUpload }
    });
export const cancelUpload = (cancelUpload=true) => ({
    type: types.CANCEL_UPLOAD,
    payload: {cancelUpload}
});


export const dispatchSetFetchingDone = () =>
    (dispatch) => {
        dispatch({
            type: types.SET_FETCHING_DONE,
        });
    };
// export const fetchUploadFiles = (uploadInProgress, pendingUploadList, uploadLength) => (
//     {
//         type: types.FETCH_UPLOAD_FILES,
//         payload: {uploadInProgress, pendingUploadList, uploadLength}
//     });
export const showUploadComponent = () => (
    {
        type: types.SHOW_UPLOAD,

    });
export const hideUploadComponent = () => (
    {
        type: types.HIDE_UPLOAD,

    });
export const uploadFiles = (acceptedFiles, toEstructura, expediente, trabajo=false, estructura = false) =>
    async (dispatch, getState) => {
        try {
            dispatch(cancelUpload(false))
            let files = []
            let typeUpload= estructura?'toEstructura':'toTemporal'

            acceptedFiles.forEach(file => {

                if (file.name.length>50)
                    throw "El fichero "+file.name+ ' tiene un nombre mayor a 50 caracteres. Prueba cambiarle el nombre por uno más pequeño.'
                let topSize = 10 *1024*1024
                if(file.size>topSize){
                    let size = renderSize(file.size)
                    throw "El fichero "+file.name+ ' ('+size+') excede el peso máximo permitido (10 Mb). Pruebe un fiechero más pequeño'
                }
                files.push({
                    filename: file.name,
                    data: file
                })
            });
            if (files.length === 0)
                return null;
            let newList = [...files]
            dispatch(fetchFiles(true, files, files.length));//estan almacenados en el reducer de status
            let errores =[];
            for (let i = 0, p = Promise.resolve(); i < files.length; i++) {
                let item = files[i];

                try {
                    p = p.then(_ => new Promise(async (resolve, reject) => {
                        try {
                            let {status} =  await  getState();

                            if(status.cancelUpload===true) {
                                debugger;
                                dispatch(resetUpladStates(typeUpload));
                                resolve();

                            }
                            else{newList.splice(0, 1);
                                let currentUpload = i + 1;
                                let currentUploadItem = item;
                                let pendingUploadList = newList;
                                dispatch(fetchFiles(true, pendingUploadList, files.length,typeUpload, currentUpload, currentUploadItem, false));//estan almacenados en el reducer de status
                                let response = toEstructura ?
                                    await api.uploadFile(expediente.Id_Expediente, trabajo, estructura.id, item) :
                                    await api.uploadFileToTemporalFolder(expediente.Id_Expediente, item);
                                if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {


                                    errores.push(response.MensajesProcesado[0].Mensaje)
                                }
                                //throw { success: false, response }

                                if (newList.length === 0) {
                                    dispatch(resetUpladStates(typeUpload));//estan almacenados en el reducer de status

                                    if(errores.length){
                                        let msg= '';
                                        errores.map(item=>{
                                            msg+='<li>'+item+'</li>'
                                        })
                                        dispatch(fetchErrorExpediente(formatMenssage('<ul>'+msg+"</ul>")))

                                    }


                                }
                            }
                        } catch (e) {
                            dispatch(resetUpladStates(typeUpload))
                            dispatch(fetchErrorExpediente(e.response))
                            reject({ success: false })
                        }


                        resolve({ success: true })

                    }
                    ));


                } catch (e) {
                    dispatch(fetchErrorExpediente(e.response))
                    return e
                }
            }

            dispatch(resetUpladStates('all'))

        } catch (e) {
            console.log('error!',e)
            dispatch(fetchErrorExpediente(formatMenssage(e)))
        }

    };


/*
*Salva una direccion desde la pantalla de nuevo expediente
*/
export const fetchsaveAdressTostore = (address, refcatastral) => (
    {
        type: types.FETCH_SAVE_ADRESS_TO_STORE,
        payload: [address, refcatastral]
    });

export const saveAdressTostore = (address, refcatastral) =>
    async (dispatch) => {
        dispatch(fetchsaveAdressTostore(address, refcatastral));
    };

/*
*Salva una direccion desde la pantalla de nuevo expediente
*/
export const fetchSuccesTrabajoDatosgenerales = (DatosTrabajo) => ({
    type: types.FETCH_SAVE_TRABAJO_TO_STORE,
    payload: DatosTrabajo
});

/*
*Salva una direccion desde la pantalla de nuevo expediente
*/
export const fetchDatosAgente = (dataAgente) => ({
    type: types.FETCH_SAVE_AGENTES_DATA,
    payload: dataAgente
});

export const cambioContenidoCentral = () => ({
    type: types.CAMBIO_CONTENEDOR_CENTRAL,

});
let renderSize=function(size) {
    if (size < 1048576) {
        return (size / 1024).toFixed(2) + ' Kb'
    } else if (size < 1073741824) {
        return (size / 1024 / 1024).toFixed(2) + ' Mb'
    } else {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' Gb'
    }

}
/*
*Obtiene la estructura documental de un trabajo
*/

export const fetchEstructuraDocumental = (id_expediente, idtrabajo) =>
    (dispatch) => {

        dispatch(fetchInit());
        dispatch(cambioContenidoCentral());
        getEstructuraDocumental(id_expediente, idtrabajo).then((expedientes) => {
            dispatch(fetchSuccessTrabajo(expedientes));
        }).catch(
            () => fetchErrorExpediente({ error: 'Algo ha salido mal' })
        );
    };


export const fetchDataResults = (data, tipoBusqueda) => ({
    type: types.RESULTADOSBUSQUEDA,
    payload: { tipoBusqueda, data }
});
export const fetchFiltroUsuario = (filtro, tipoBusqueda) => ({
    type: types.FILTROBUSQUEDA,
    payload: {
        filtro,
        tipoBusqueda
    }
});

/*
*Buscador de elementos del usuario logeado
*filtro: cadena a buscar
*tipoBusqueda: expediente,trabajos, colegiados, promotores
*/
export const fetchBuscador = (filtro, tipoBusqueda, page = 1, pageSize = 100000) =>
    async (dispatch) => {
        let temp = '';
        let temp2 = '';
        console.log(filtro,tipoBusqueda)
        if (filtro != null) {
            temp = filtro;
        }
        if (tipoBusqueda != null) {
            temp2 = filtro;
        }
        else {
            temp2 = 'expedientes';
        }

        dispatch(fetchFiltroUsuario(temp, temp2));
        try {
            let searchResult = await getBuscador(temp, tipoBusqueda, page, pageSize);
            searchResult.data.MensajesProcesado && searchResult.data.MensajesProcesado.length > 0
                ?
                dispatch(fetchErrorExpediente(searchResult.data))
                :
                dispatch(fetchDataResults(searchResult, tipoBusqueda));
            return searchResult;
        } catch (error) {
            dispatch(fetchErrorExpediente(formatMenssage(error.message)));
        }
    };

/*
*Obtiene la estructura documental de un trabajo
*id_expediente
*idtrabajo
*/
export const fetchEstructuraDocumentalTrabajo = (id_expediente, idtrabajo) =>
    (dispatch) => {
        dispatch(fetchInit());
        getEstructuraDocumental(id_expediente, idtrabajo).then((expedientes) => {
            dispatch(fetchSuccessTrabajo(expedientes));
        })
            .catch(
                () => fetchErrorExpediente({ error: 'Algo ha salido mal' })
            );
    };
/*
*obtiene los datos generales de un expediente
*id_expediente
*/
export const fetchExpedienteDatosGeneral = (id_expediente) =>
    (dispatch) => {

        getExpedienteDatosGeneral(id_expediente).then((expedientes) => {

            dispatch(fetchSuccesExpediente(expedientes));
        })
            .catch(
                () => fetchErrorExpediente({ error: 'Algo ha salido mal' })
            );
    };
/*
*obtiene los datos generales de un expediente
*id_expediente
*/
export const fetchExpedienteTrabajos = (id_expediente) =>
    (dispatch) => {

        GettrabajosExpediente(id_expediente).then((trabajos) => {

            dispatch(fetchSuccesTrabajosExpediente(trabajos));
        })
            .catch(
                () => fetchErrorExpediente({ error: 'Algo ha salido mal' })
            );
    };



export const validateAddress = (id_ubicacion) =>
    async (dispatch) => {
        try {
            let response = await getValidateAddress(id_ubicacion);
            response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
                dispatch(fetchErrorExpediente(response.data))
                :
                dispatch(fetchAddress(response.data, id_ubicacion))
        } catch (error) {
            dispatch(fetchErrorExpediente(formatMenssage(error.message)));
        }

    };

export const updateAddress = (address) =>
    (dispatch) => {
        dispatch(fetchUpdateAddress(address));
    }

/*
*
*Obtiene los expedientes de un usuario logeado y con token
*
*/
export const fetchexpedientesUser = () =>
    async (dispatch) => {
        try {
            let response = await expedientesuser();
            response.MensajesProcesado && response.MensajesProcesado.length > 0
                ? dispatch(fetchErrorExpediente(response))
                : dispatch(fetchSuccess(response.Expedientes));

        } catch (error) {
            dispatch(fetchErrorExpediente(formatMenssage(error.message)));
        }
    };
/**
 * Insertar nuevo expediente con emplazamientos
 * @param data
 * @returns {Function}
 */
export const postUbicacion = (data) =>
    async dispatch => {
        try {
            let response = await postNuevoExpediente(data);
            response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
                dispatch(fetchErrorExpediente(response.data))
                : dispatch(fetchExpedientSave(response.data))
        } catch (error) {
            dispatch(fetchErrorExpediente(formatMenssage(error.message)));
        }
    };


export const getAgentes = (id_agente) =>
    dispatch => {

        dispatch(fetchDatosAgente(getAgentesInfo(id_agente)));
    };


/*
*Guarda los datos generales de un trabajo
*/
export const fetchTrabajoDatosGeneral = (id_expediente, id_Trabajo) =>
    (dispatch) => {

        getTrabajoeDatosGenerales(id_expediente, id_Trabajo).then((DatosTrabajo) => {

            dispatch(fetchSuccesTrabajoDatosgenerales(DatosTrabajo));
        })
            .catch(
                () => fetchErrorExpediente({ error: 'Algo ha salido mal' })
            );
    };


const setExpediente = payload => ({ type: types.SET_EXPEDIENTE_SELECTED, payload });
const setExpedienteSelected = payload => ({ type: types.SET_EXPEDIENTE_SELECTED_DATOS, payload });


export const fetchSuccesTrabajoDatosgeneralesSelected = (data) => ({
    type: types.SET_EXPEDIENTE_SELECTED_DATOS_TRABAJO,
    payload: data
});
export const fetchDatosExpeFichaTrabajo = (datos) => ({
    type: types.SET_EXPEDIENTE_SELECTED_DATOS_TRABAJOFICHA,
    payload: datos
});
// export const fetchSuccesdatosExpSeleccionado = (datos) => ({

//     type: types.SET_EXPEDIENTE_SELECTED_DATOS_GENERALES,
//     payload: datos
// });

export const setSelectedExpediente = payload => {
    return dispatch => {
        dispatch(setExpediente(payload));
        dispatch(setExpedienteSelected(payload));
    }


};
export const setSelectedExpedienteTo = (datos) =>

    (dispatch) => {

        //let datos =[id_expediente,id_Trabajo]
        //dispatch(fetchSuccesdatosExpSeleccionado(datos));


        dispatch(fetchDatosExpeFichaTrabajo(datos))
        getTrabajoeDatosGenerales(datos.Id_Expediente, datos.Id_Trabajo).then((data) => {


            dispatch(fetchSuccesTrabajoDatosgeneralesSelected(data));

        })
            .catch(
                () => fetchErrorExpediente({ error: 'Algo ha salido mal' })
            );

    };

/*
*Salva una direccion desde la pantalla de nuevo expediente
*/
export const fetchSelectedNode = (node) => ({

    type: types.FETCH_SAVE_SELECTED_NODE_TO_STORE,
    payload: node
});

export const fetchSelectedExpediente = (exp) => ({

    type: types.FETCH_SAVE_SELECTED_EXPEDIENTE_TO_STORE,
    payload: exp
});

/*
*Salva las acciones pendientes de un usuario
*/
export const fetchgetAcciones = (id_expediente, id_Trabajo) =>
    (dispatch) => {

        getAcciones().then((response) => {

        })
            .catch(
                () => fetchErrorExpediente({ error: 'Algo ha salido mal' })
            );
    };

export const fetchelimardelatabla = (nodos, parametro) => ({

    type: types.ELIMINAR_TABLA,
    payload: [nodos, parametro]
});

export const elimardelatabla = (nodos, referencias) => (dispatch) => {

    dispatch(fetchelimardelatabla(nodos, referencias));
};

/**Acciones para manejar la seccion de promotores */
/**1- Limpiar la búsqueda */
export const dispatchLimpiarBusquedaPromotores = () => (dispatch) => {
    dispatch({
        type: types.LIMPIAR_BUSQUDA,
        payload: []
    })
}

/**2- Adicionar promotor */
export const dispatchAddPromotor = (promotor) => (dispatch) => {
    dispatch({
        type: types.ADD_PROMOTOR,
        payload: promotor
    })
}

/**Editar promotor */
export const dispatchEditPromotor = (promotor) => (dispatch) => {
    dispatch({
        type: types.EDIT_PROMOTOR,
        payload: promotor
    })
}

/**Eliminar un promotor */
export const dispatchDeletePromotor = (nif) => (dispatch) => {
    dispatch({
        type: types.DELETE_PROMOTOR,
        payload: nif
    })
}

/**Adicionar trabajos a un expediente */
export const dispatchAddTrabajoEncomendaExpediente = (trabajoExpediente) => (dispatch) => {
    dispatch({
        type: types.ADD_TRABAJO_EXPEDIENTE,
        payload: trabajoExpediente
    })
}

/**Edita los datos de un expediente dentro de un trabajo encomenda */
export const dispatchEditExpedienteEnTrabajo = (expediente) => (dispatch) => {
    dispatch({
        type: types.EDIT_EXPEDIENTE_EN_TRABAJO,
        payload: [expediente]
    })
}

/**Post al servicio de adicionar trabajo encomenda a un expediente */
export const postAddTrabajoEncomenda = (idExpediente, dataPost) => async (dispatch) => {
    try {
        let response = await addTrabajoEncomendaExpediente(idExpediente, dataPost)
        if (response.data) {
            response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0
                ? dispatch(fetchErrorExpediente(response.data))
                : dispatch(dispatchAddTrabajoEncomendaExpediente(response.data));
            return response.data.MensajesProcesado.length === 0;
        }
        else if (response.response) {
            let dataResponse = response.response.data;
            dataResponse.MensajesProcesado && dataResponse.MensajesProcesado.length > 0
                ? dispatch(fetchErrorExpediente(dataResponse))
                : dispatch(dispatchAddTrabajoEncomendaExpediente(dataResponse));
            return dataResponse.MensajesProcesado.length === 0;
        }
        return false;
    } catch (error) {
        dispatch(fetchErrorExpediente(formatMenssage(error.message)));
    }
};

/**Encargado de guardar en el expediente, el objeto Autorizacion municipal
 * y Grupo tematico */
export const dispatchAddAutorizacion = (idExpediente, data) => (dispatch) => {
    dispatch({
        type: types.ADD_AUTORIZACION_GRUPO_EXPEDIENTE,
        payload: { idExpediente, data }
    })
}

export const dispatchTablePersonalization = (pageSize, defColumns, renderValue) => (dispatch) => {
    dispatch({
        type: types.TABLE_PERSONALIZATION,
        payload: {
            pageSize: pageSize,
            columnDefs: defColumns,
            renderValue: renderValue
        }
    })
}

