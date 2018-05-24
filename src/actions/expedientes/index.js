import { getEstructuraDocumental, getValidateAddress,  postNuevoExpediente, getExpedienteDatosGeneral,
    getTrabajoeDatosGenerales, getAgentesInfo } from '../../api';

import * as types from './types';

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
export const fetchEstructuraDocumentalTrabajo = (id_expediente, idtrabajo) => 
(dispatch) => {
    console.log(id_expediente);
    console.log(idtrabajo);
    
    dispatch(fetchInit());
    getEstructuraDocumental(id_expediente,idtrabajo).then((expedientes) => {
       
        dispatch(fetchSuccessTrabajo(expedientes));
       
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


export const getAgentes  = (id_agente)=>
dispatch => {   
     
       dispatch(fetchDatosAgente(getAgentesInfo(id_agente)));
};
   
  /* export const getAgentes  = (id_agente)=>
   dispatch => {   
    getAgentesInfo(id_agente).then((response)=>{
        dispatch(fetchDatosAgente(response));
    }).catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    )
          
      };*/
      
/*
*Guarda los datos generales de un trabajo
*/
export const fetchTrabajoDatosGeneral = (id_expediente, id_Trabajo) => 
(dispatch) => {
              console.log("fetchTrabajoDatosGeneral");
          getTrabajoeDatosGenerales(id_expediente, id_Trabajo).then((DatosTrabajo) => {              
              dispatch(fetchSuccesTrabajoDatosgenerales(DatosTrabajo));
                      })
              .catch(
              () => fetchError({ error: 'Algo ha salido mal'})
          );
      };


const setExpediente = payload => ({ type: types.SET_EXPEDIENTE_SELECTED, payload });
const setExpedienteSelected = payload => ({ type: types.SET_EXPEDIENTE_SELECTED_DATOS, payload });
const fetchSuccesTrabajoDatosgeneralesSelected = payload =>({type: types.SET_EXPEDIENTE_SELECTED_DATOS_TRABAJO, payload});

export const setSelectedExpediente = payload => {
    const {id_expediente, id_Trabajo} =payload;
    console.log("Clic desde ---------------Componente LateralClic desde ---------------Componente Lateral");
    console.log(payload.id_expediente);
    console.log(payload);
          return dispatch =>{
            dispatch(setExpediente(payload));
            dispatch(setExpedienteSelected(payload));
          }
       
    
};
export const setSelectedExpedienteTo = (id_expediente,id_Trabajo) => 
   
    (dispatch) =>{
            getTrabajoeDatosGenerales(id_expediente,id_Trabajo).then((data) =>{
                 dispatch(fetchSuccesTrabajoDatosgeneralesSelected(data));
                })
                 .catch(
              ()=> fetchError({ error: 'Algo ha salido mal'})
        );             
    
};
