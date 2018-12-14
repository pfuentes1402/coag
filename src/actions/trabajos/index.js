import {
    getAllBuilds,
    getTiposTrabajo,
    getTiposAutorizacionMunicipal,
    getFasesTrabajos,
    getestructuradocumental,
    getGruposRaiz,
    getFuncionesTipologia,
    addAgentesTrabajo
} from '../../api';


import * as types from './types';

const formatMenssage = (error) => (
    {
        "MensajesProcesado": [ {"Mensaje": error}]
    }
)
export const fetchTiposTrabajo = (gruposTematicos) => ({
    type: types.FETCH_TIPOS_TRABAJO,
    payload: gruposTematicos,
});

export const fetchTiposAutorizacion = (tiposAutorizacion) => ({
    type: types.FETCH_TIPOS_AUTORIZACION,
    payload: tiposAutorizacion,
});

export const dispatchFasesTrabajos = (fasesTrabajos) => ({
    type: types.FETCH_FASES_TRABAJOS,
    payload: fasesTrabajos
});

export const fetchErrorTrabajo = (error) => ({
    type: types.FETCH_TRABAJOS_ERROR,
    payload: error
});

export const gruposRaiz = (value) => {
    return {
        type: types.FETCH_GRUPOS_RAIZ,
        payload: value
    }
}

export const funcionesTipologias = (value) => {
    return {
        type: types.FETCH_FUNCIONES_TIPOLOGIA,
        payload: value
    }
}

export const comunicacionEncargo = (value) =>{
    return{
        type: types.FETCH_COMUNICACION_ENCARGO,
        payload: value
    }
}

// export const FuncioncambioContenidoCentral = () =>(dispatch)=>{

//     dispatch(cambioContenidoCentral);
// }

export const cambioContenidoCentralReset = (error) => ({
    type: types.CAMBIO_CONTENEDOR_CENTRAL_RESET,
    payload: error
});

/**
 * Devuelve los grupos tematicos o tipos de obra
 * @param idGrupoTematico id del grupo raiz
 * @param idLanguage
 * @returns {Function}
 */
export const fetchTipoTrabajo = (idGrupoTematico, idLanguage = 2) => async (dispatch) => {
    try {
        let response = await getTiposTrabajo(idGrupoTematico, idLanguage);
        response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
            dispatch(fetchErrorTrabajo(response.data))
            :
            dispatch(fetchTiposTrabajo(response.data))
    }catch (error) {
        dispatch(fetchErrorTrabajo(formatMenssage(error.message)));
    }

};

/**
 * Devuelve los tipos de autorizaion municipal o tipos de tramite
 * @param idLanguage
 * @returns {Function}
 */
export const fetchTipoAutorizacion = (idLanguage = 2) => async (dispatch) => {
    try {
        let response = await getTiposAutorizacionMunicipal(idLanguage);
        response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
            dispatch(fetchErrorTrabajo(response.data))
            :
            dispatch(fetchTiposAutorizacion(response.data))
    }catch (error) {
        dispatch(fetchErrorTrabajo(formatMenssage(error.message)));
    }
};


/**
 * Devuelve las fases de trabajos
 * @param idGrupoTematico o tipo de obra
 * @param idTipoAutorizacion o tipo de tramite
 * @param idLanguage
 * @returns {Function}
 */
export const fetchFasesTrabajos = (idGrupoTematico, idTipoAutorizacion, idLanguage=2) => async (dispatch) => {
    try {
        let response = await getFasesTrabajos(idGrupoTematico, idTipoAutorizacion, idLanguage);
        response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
            dispatch(fetchErrorTrabajo(response.data))
            :
            dispatch(dispatchFasesTrabajos(response.data))
    }catch (error) {
        dispatch(fetchErrorTrabajo(formatMenssage(error.message)));
    }
};

/**
 * Devuelve los grupos raiz
 * @param idGrupoRaiz
 * @returns {Function}
 */
export const fetchGruposRaiz = (idLanguage = 2) => async (dispatch) => {
    try {
        let response = await getGruposRaiz(idLanguage);
        response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
            dispatch(fetchErrorTrabajo(response.data))
            :
            dispatch(gruposRaiz(response.data))
    }catch (error) {
        dispatch(fetchErrorTrabajo(formatMenssage(error.message)));
    }

};
/**
 * Almacenar el obejeto de comunicacion de encargo
 * @returns {Function}
 */
export const fetchComunicacionencargo = (value) => async (dispatch) => {
    dispatch(comunicacionEncargo(value))
};

export const fetchFuncionesTipologia = (idLanguage = 1) => (dispatch) => {
    getFuncionesTipologia(idLanguage).then((funcionesTip) => {
        dispatch(funcionesTipologias(funcionesTip));
    }).catch(
        () => fetchError({ error: 'Algo ha salido mal' })
    );
}


export const fetchEstructuraDocumentalTrabajo = (idExpediente, idTrabajo) => (dispatch) => {
    getestructuradocumental(idExpediente, idTrabajo).then((estructuraDoc) => {

        dispatch(dispatchEstructuraDocumentalTrabajo(estructuraDoc));
    }).catch(
        () => fetchErrorTrabajo({ error: 'Algo ha salido mal' })
    );
};


export const dispatchEstructuraDocumentalTrabajo = (estructuraDoc) => ({
    type: types.FETCH_ESTRUCTURA_DOCUMENTAL_TRABAJO,
    payload: estructuraDoc
});

export const dispachFilesToUpload = (files) => ({
    type: types.FILES_TO_UPLOAD,
    payload: files
});


//TODO: Queda consumir el servicio si fuera necesario aquí
export const dispatchAddAgenteTrabajoSeleccion = (idExpediente,idTrabajo,agent) => (dispatch) => {
    let dataPost = [{
        Id_Entidad: agent.Id_Entidad,
        Firma: 1,
        Ids_Funciones: "32",
        PorcentajesEquitativos: 1,
        Porcentaje: agent.Porciento
    }]
    addAgentesTrabajo(idExpediente,idTrabajo,dataPost).then(response=>{
        dispatch(addAgenteTrabajoSeleccion(agent));
    }).catch(
        () => fetchError({ error: 'Algo ha salido mal' })
    );
}

//TODO: Queda consumir el servicio si fuera necesario aquí
export const dispatchDeleteAgenteTrabajoSeleccion = (id) => (dispatch) => {
    dispatch(deleteAgenteTrabajoSeleccion(id));
}

export const dispatchEditAgenteTrabajoSeleccion = (agente) => (dispatch) => {
    dispatch(editAgenteTrabajoSeleccion(agente));
}

export const addAgenteTrabajoSeleccion = (agente) => ({
    type: types.ADD_AGENTE_TRABAJO,
    payload: agente
});

export const deleteAgenteTrabajoSeleccion = (agente) => ({
    type: types.DELETE_AGENTE_TRABAJO,
    payload: agente
});

export const editAgenteTrabajoSeleccion = (agente) => ({
    type: types.EDIT_AGENTE_TRABAJO,
    payload: agente
});