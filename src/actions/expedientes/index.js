import { getEstructuraDocumental, getValidateAddress,  postNuevoExpediente, getExpedienteDatosGeneral } from '../../api';

import * as types from './types';

export const fetchInit = () => ({
    type: types.FETCH_EXPEDIENTES_INIT
});

export const fetchSuccess = (expedientes) => ({
    type: types.FETCH_EXPEDIENTES_SUCCESS,
    payload: expedientes
});

export const fetchSuccesExpediente = (data) => ({
    type: types.FETCH_EXPEDIENTE_SUCCESS_EXP,
    payload: data
});

export const fetchError = (error) => ({
    type: types.FETCH_EXPEDIENTES_ERROR,
    payload: error
});

export const fetchAddress = (response) => ({   
    type: types.FETCH_UBICACION_SUCCESS,   
    payload: response
});

export const fetchExpedientSave = (response) => ({   
    type: types.FETCH_EXPEDIENTSAVE_TO_STORE,   
    payload: response
});

/*
*Salva una direccion desde la pantalla de nuevo expediente
*/
export const saveAdressTostore = (address) => ({
    type: types.FETCH_SAVE_ADRESS_TO_STORE,
    payload: address
});



export const fetchEstructuraDocumental = (id_expediente, idtrabajo) => 
(dispatch) => {
    
    dispatch(fetchInit());
    getEstructuraDocumental(id_expediente,idtrabajo).then((expedientes) => {
        
        dispatch(fetchSuccess(expedientes));
       
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};

export const fetchExpedienteDatosGeneral = (id_expediente) => 
(dispatch) => {
        
    getExpedienteDatosGeneral(id_expediente).then((expedientes) => {
        
        dispatch(fetchSuccesExpediente(expedientes));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};



export const validateAddress = (id_ubicacion) => 

(dispatch) => {
    getValidateAddress(id_ubicacion).then((response) => {
        
        dispatch(fetchAddress(response, id_ubicacion));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};

export   const postUbicacion = (data)=>
 dispatch => {
    postNuevoExpediente(data).then((response) => {
      
        dispatch(fetchExpedientSave(response));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
    
};




