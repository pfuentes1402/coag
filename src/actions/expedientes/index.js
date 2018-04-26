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

export const fetchAddress = (response) => ({
    type: types.FETCH_UBICACION_SUCCESS,
    payload: response
})

export const fetchExpedientes = (id_expediente) => 
(dispatch) => {
    console.log("dispatch: "+ dispatch);
    dispatch(fetchInit());
    getExpedientes(id_expediente).then((expedientes) => {
        
        dispatch(fetchSuccess(expedientes));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};

export const validateAddress2 = () => {
    console.log("llega");
}

export const validateAddress = (id_ubicacion) => 
(dispatch) => {
    getValidateAdress(id_ubicacion).then((response) => {
        dispatch(fetchAddress(response));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};
