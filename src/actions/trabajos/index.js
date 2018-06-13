import { getTiposTrabajo, getTiposAutorizacionMunicipal } from '../../api';

import * as types from './types';

export const fetchTiposTrabajo = (gruposTematicos) => ({
    type: types.FETCH_TIPOS_TRABAJO,
    payload: gruposTematicos,
});

export const fetchTiposAutorizacion = (tiposAutorizacion) => ({
    type: types.FETCH_TIPOS_AUTORIZACION,
    payload: tiposAutorizacion,
});

export const fetchError = (error) => ({
  type: types.FETCH_TRABAJOS_ERROR,
  payload: error
});

export const fetchTipoTrabajo = (idGrupoTematico) => (dispatch) => {
    getTiposTrabajo(idGrupoTematico).then((gruposTematicos) => {
      dispatch(fetchTiposTrabajo(gruposTematicos));
    }).catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};


export const fetchTipoAutorizacion = () => (dispatch) => {
    getTiposAutorizacionMunicipal().then((tiposAutorizacion) => {
      dispatch(fetchTiposAutorizacion(tiposAutorizacion));
    }).catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};