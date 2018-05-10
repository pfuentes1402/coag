import { getExpedientes, getValidateAdress, getExpediente, postValidAdress, getExpedienteDatosGeneral } from '../../api';

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
export const fetchSuccesExpediente = (data) => ({
    type: types.FETCH_EXPEDIENTE_SUCCESS_EXP,
    payload: data
});

export const fetchError = (error) => ({
    type: types.FETCH_EXPEDIENTES_ERROR,
    payload: error
});

export const fetchAddress = (response, id_ubicacion) => ({
    //Todo pasar variable de referencia catastral hasta el reducer
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
export const fetchExpedienteDatosGeneral = (id_expediente) => 
(dispatch) => {
    console.log(`dispatch:Llega a fetchExpedienteDatosGeneral_${id_expediente}`);
    
    getExpedienteDatosGeneral(id_expediente).then((expedientes) => {
        
        dispatch(fetchSuccesExpediente(expedientes));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};





export const fetchExpedientSave = (response) => ({   
    type: types.FETCH_EXPEDIENTSAVE_TO_STORE,   
    payload: response
});



export const validateAddress = (id_ubicacion) => 

(dispatch) => {
    getValidateAdress(id_ubicacion).then((response) => {
        
        dispatch(fetchAddress(response, id_ubicacion));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};

export   const postUbicacion = (data)=>
 dispatch => {
    console.log("llega a postUbicacion");
    postValidAdress(data).then((response) => {
      
        dispatch(fetchExpedientSave(response));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
    
};


export const saveAdressTostore = (address) => ({
    type: types.FETCH_SAVE_ADRESS_TO_STORE,
    payload: address
});



