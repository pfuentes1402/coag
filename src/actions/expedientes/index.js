import { getExpedientes, getValidateAdress } from '../../api';

import * as types from './types';

export const fetchInit = () => ({
   
    type: types.FETCH_EXPEDIENTES_INIT
});

export const fetchSuccess = (expedientes) => ({
    type: types.FETCH_EXPEDIENTES_SUCCESS,
    payload: expedientes
});

export const fetchError = (error) => ({
    type: types.FETCH_EXPEDIENTES_ERROR,
    payload: error
});

export const fetchExpedientes = (id_expediente) => (dispatch) => {
    dispatch(fetchInit());
    getExpedientes(id_expediente).then((expedientes) => {
        
        dispatch(fetchSuccess(expedientes));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};

export const validateAdress = () => (dispatch) => {
    dispatch(fetchInit());
    console.log("llega hasta action");
    getValidateAdress().then((expedientes) => {
        
        dispatch(fetchSuccess(expedientes));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};


