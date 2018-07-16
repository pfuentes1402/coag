import { getEstructuraDocumental, getValidateAddress,  postNuevoExpediente, getExpedienteDatosGeneral,
    getTrabajoeDatosGenerales, getAgentesInfo, expedientesuser, getAcciones } from '../../api';

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
export const fetchExpedienteSelected = (response) => ({   
    type: types.FETCH_SAVE_SELECTED_EXP_TO_STORE,   
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

export const cambioContenidoCentral = () => ({  
    type: types.CAMBIO_CONTENEDOR_CENTRAL,
  
});


export const fetchEstructuraDocumental = (id_expediente, idtrabajo) => 
(dispatch) => {
   
    dispatch(fetchInit());
    dispatch(cambioContenidoCentral());
    getEstructuraDocumental(id_expediente,idtrabajo).then((expedientes) => {
        console.log(expedientes);
        dispatch(fetchSuccessTrabajo(expedientes));
       
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};
export const fetchEstructuraDocumentalTrabajo = (id_expediente, idtrabajo) => 
(dispatch) => {
   
    
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
        dispatch(fetchAddress(response.data, id_ubicacion));
    })
        .catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};
/*
*
*Obtiene los expedientes de un usuario logeado y con token
*
*/
export const fetchexpedientesUser = () => 

(dispatch) => {
    expedientesuser().then((response) => {
        console.log('expedientesuser en el fetch');      
        console.log(response);
        dispatch(fetchSuccess(response));
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
   
 
/*
*Guarda los datos generales de un trabajo
*/
export const fetchTrabajoDatosGeneral = (id_expediente, id_Trabajo) => 
(dispatch) => {
              
          getTrabajoeDatosGenerales(id_expediente, id_Trabajo).then((DatosTrabajo) => {       
              console.log('fetchTrabajoDatosGeneral');       
              dispatch(fetchSuccesTrabajoDatosgenerales(DatosTrabajo));
                      })
              .catch(
              () => fetchError({ error: 'Algo ha salido mal'})
          );
      };


const setExpediente = payload => ({ type: types.SET_EXPEDIENTE_SELECTED, payload });
const setExpedienteSelected = payload => ({ type: types.SET_EXPEDIENTE_SELECTED_DATOS, payload });


export const fetchSuccesTrabajoDatosgeneralesSelected = (data) => ({
    type: types.SET_EXPEDIENTE_SELECTED_DATOS_TRABAJO,
    payload: data
});
// export const fetchSuccesdatosExpSeleccionado = (datos) => ({
    
//     type: types.SET_EXPEDIENTE_SELECTED_DATOS_GENERALES,
//     payload: datos
// });

export const setSelectedExpediente = payload => {

    const {id_expediente, id_Trabajo} =payload;
   console.log("antes de mandara el dispatch de setExpedienteSelected ");
          return dispatch =>{
            dispatch(setExpediente(payload));
            dispatch(setExpedienteSelected(payload));
          }
       
    
};
export const setSelectedExpedienteTo = (id_expediente,id_Trabajo) => 
  
    (dispatch) =>{
     //let datos =[id_expediente,id_Trabajo]
        //dispatch(fetchSuccesdatosExpSeleccionado(datos));
        getTrabajoeDatosGenerales(id_expediente,id_Trabajo).then((data) =>{               
          
                 dispatch(fetchSuccesTrabajoDatosgeneralesSelected(data));
                
                })
                 .catch(
              ()=> fetchError({ error: 'Algo ha salido mal'})
        );             
    
};

/*
*Salva una direccion desde la pantalla de nuevo expediente
*/
export const fetchSelectedNode = (node) => ({
    
    type: types.FETCH_SAVE_SELECTED_NODE_TO_STORE,
    payload: node
});

export const fetchSelectedExpediente = (exp) => ({
    
    type: types.FETCH_SAVE_SELECTED_EXPEDIENTE_TO_STORE,
    payload: exp
});

/*
*Salva las acciones pendientes de un usuario
*/
export const fetchgetAcciones= (id_expediente, id_Trabajo) => 
(dispatch) => {
              
    getAcciones().then((response) => {              
              console.log(response);
                      })
              .catch(
              () => fetchError({ error: 'Algo ha salido mal'})
          );
      };