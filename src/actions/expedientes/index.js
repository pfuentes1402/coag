import { getExpedientes, getValidateAdress, getExpediente, postValidAdress } from '../../api';

import * as types from './types';

export const fetchInit = () => ({
    type: types.FETCH_EXPEDIENTES_INIT
});

export const fetchSuccess = (expedientes) => ({
    type: types.FETCH_EXPEDIENTES_SUCCESS,
    payload: expedientes
});
export const fetchSucces = (trabajos) => ({
    type: types.FETCH_EXPEDIENTE_SUCCESS,
    payload: trabajos
});

export const fetchError = (error) => ({
    type: types.FETCH_EXPEDIENTES_ERROR,
    payload: error
});

export const fetchAddress = (response) => ({
    type: types.FETCH_UBICACION_SUCCESS,
    payload: response
});

export const fetchExpedientes = (id_expediente) => 
(dispatch) => {
    
    dispatch(fetchInit());
    getExpedientes(id_expediente).then((expedientes) => {
        
        dispatch(fetchSuccess(expedientes));
       
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};

export const fetchExpediente = (id_expediente) => 
(dispatch) => {
    console.log("dispatch:Llega a fetchExpediente ");
    dispatch(fetchInit());
    getExpediente(id_expediente).then((expedientes) => {
        
        dispatch(fetchSucces(expedientes));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};



export const validateAddress = (id_ubicacion) => 
(dispatch) => {
    getValidateAdress(id_ubicacion).then((response) => {
        dispatch(fetchAddress(response));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};
export const postUbicacion = (data) => 
(dispatch) => {
    postValidAdress(data).then((response) => {
        console.log("llega a post");
        console.log(response);
        dispatch(fetchAddress(response));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};

