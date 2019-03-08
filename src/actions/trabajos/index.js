import {

    getTiposTrabajo,
    getTiposAutorizacionMunicipal,
    getFasesTrabajos,
    getEstructuraDocumental,
    getGruposRaiz,
    getFuncionesTipologia,

} from '../../api';


import * as types from './types';

const formatMenssage = (error) => (
    {
        "MensajesProcesado": [{ "Mensaje": error }]
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

/**Función que dispara un error desde cualquier parte */
export const dispatchError = (error) => (dispatch) => {
    dispatch(fetchErrorTrabajo(formatMenssage(error)));
}

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

export const comunicacionEncargo = (value) => {
    return {
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
        response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0
            ? dispatch(fetchErrorTrabajo(response.data))
            : dispatch(fetchTiposTrabajo(response.data))
        return {
            Id_Tipo_Grupo_Raiz: idGrupoTematico,
            tiposTrabajos: response.data ? response.data.GruposTematicos : []
        }
    } catch (error) {
        dispatch(fetchErrorTrabajo(formatMenssage(error.message)));
    }

};

//Disparador de accion para salvar el tipo de obras
export const saveObras = (tiposObras) => ({
    type: types.SAVE_TIPOS_OBRA,
    payload: tiposObras
});

export const saveTiposObras = (tiposObras) => (dispatch) => {
    dispatch(saveObras(tiposObras));
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
            : dispatch(fetchTiposAutorizacion(response.data))
    } catch (error) {
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
export const fetchFasesTrabajos = (idGrupoTematico, idTipoAutorizacion, idLanguage = 2) => async (dispatch) => {
    try {
        let response = await getFasesTrabajos(idGrupoTematico, idTipoAutorizacion, idLanguage);
        response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
            dispatch(fetchErrorTrabajo(response.data))
            :
            dispatch(dispatchFasesTrabajos(response.data))
    } catch (error) {
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
    } catch (error) {
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

export const fetchFuncionesTipologia = (idLanguage = 1, idGrupoTematico = 0, idAutorizacionMunicipal = 0) => async (dispatch) => {
    try {
        let response = await getFuncionesTipologia(idLanguage, idGrupoTematico, idAutorizacionMunicipal);
        response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
            dispatch(fetchErrorTrabajo(response.data))
            : dispatch(funcionesTipologias(response));
    } catch (error) {
        dispatch(fetchErrorTrabajo(formatMenssage(error.message)));
    }
}


export const fetchEstructuraDocumentalTrabajo = (idExpediente, idTrabajo) => (dispatch) => {
    getEstructuraDocumental(idExpediente, idTrabajo).then((estructuraDoc) => {
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


//Adicionar Agentes(arquitectos) a un trabajo
export const dispatchAddAgenteTrabajoSeleccion = (idExpediente, idTrabajo, agent) => async (dispatch) => {
    try {
        //let response = await addAgentesTrabajo(idExpediente,idTrabajo, dataPost);
        dispatch(addAgenteTrabajoSeleccion(agent));
    } catch (error) {
        dispatch(fetchErrorTrabajo(formatMenssage(error.message)));
    }

}

//Eleiminado un agente de trabajo del estado de redux
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