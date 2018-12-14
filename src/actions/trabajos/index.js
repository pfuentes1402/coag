import {
    getAllBuilds, getTiposTrabajo, getTiposAutorizacionMunicipal,
    getFasesTrabajos, getestructuradocumental, getFuncionesTipologia,
    addAgentesTrabajo
} from '../../api';

import * as types from './types';

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

export const fetchError = (error) => ({
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


// export const FuncioncambioContenidoCentral = () =>(dispatch)=>{

//     dispatch(cambioContenidoCentral);
// }

export const cambioContenidoCentralReset = (error) => ({
    type: types.CAMBIO_CONTENEDOR_CENTRAL_RESET,
    payload: error
});


export const fetchTipoTrabajo = (idGrupoTematico, idLanguage = 1) => (dispatch) => {
    getTiposTrabajo(idGrupoTematico, idLanguage).then((gruposTematicos) => {
        dispatch(fetchTiposTrabajo(gruposTematicos));
    }).catch(
        () => fetchError({ error: 'Algo ha salido mal' })
    );
};

export const fetchTipoAutorizacion = (idLanguage) => (dispatch) => {
    getTiposAutorizacionMunicipal(idLanguage).then((tiposAutorizacion) => {
        dispatch(fetchTiposAutorizacion(tiposAutorizacion));
    }).catch(
        () => fetchError({ error: 'Algo ha salido mal' })
    );
};



export const fetchFasesTrabajos = (idGrupoTematico, idTipoAutorizacion, idLanguage) => (dispatch) => {
    getFasesTrabajos(idGrupoTematico, idTipoAutorizacion, idLanguage).then((fasesTrabajos) => {
        dispatch(dispatchFasesTrabajos(fasesTrabajos));
    }).catch(
        () => fetchError({ error: 'Algo ha salido mal' })
    );
};

export const fetchGruposRaiz = (idGrupoRaiz) => (dispatch) => {
    dispatch(gruposRaiz(idGrupoRaiz));
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
        () => fetchError({ error: 'Algo ha salido mal' })
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
export const dispatchDeleteAgenteTrabajoSeleccion = (nif) => (dispatch) => {
    dispatch(deleteAgenteTrabajoSeleccion(nif));
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