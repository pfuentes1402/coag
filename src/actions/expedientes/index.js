import { getEstructuraDocumental, getValidateAddress,  postNuevoExpediente, getExpedienteDatosGeneral,
    getTrabajoeDatosGenerales, getAgentesInfo, expedientesuser, getAcciones, getBuscador, GettrabajosExpediente } from '../../api';

import * as types from './types';

const formatMenssage = (error) => (
      {
        "MensajesProcesado": [ {"Mensaje": error}]
     }
)

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
export const fetchSuccesTrabajosExpediente = (data) => ({
    type: types.FETCH_EXPEDIENTE_TRABAJOS_EXP,
    payload: data
});

export const fetchErrorExpediente = (error) => ({
    type: types.FETCH_EXPEDIENTES_ERROR,
    payload: error
});

export const fetchAddress = (response) => ({   
    type: types.FETCH_UBICACION_SUCCESS,   
    payload: response
});

export const fetchUpdateAddress = (response) => ({
    type: types.FETCH_UBICACION_UPDATE,
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
export const fetchsaveAdressTostore = (address,refcatastral) => (  
    {
    type: types.FETCH_SAVE_ADRESS_TO_STORE,
    payload:[address,refcatastral]
});

export const saveAdressTostore = (address, refcatastral) =>
    async (dispatch) => {
        dispatch(fetchsaveAdressTostore(address, refcatastral));
};

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

/*
*Obtiene la estructura documental de un trabajo
*/
export const fetchEstructuraDocumental = (id_expediente, idtrabajo) => 
(dispatch) => {
   
    dispatch(fetchInit());
    dispatch(cambioContenidoCentral());
    getEstructuraDocumental(id_expediente,idtrabajo).then((expedientes) => {       
        dispatch(fetchSuccessTrabajo(expedientes));       
    }).catch(
        () => fetchErrorExpediente({ error: 'Algo ha salido mal'})
    );
};


export const fetchDataResults= (data,tipoBusqueda) =>({
    type:types.RESULTADOSBUSQUEDA,
    payload:{tipoBusqueda,data}
});
export const fetchFiltroUsuario = (filtro, tipoBusqueda) => ({
    type:types.FILTROBUSQUEDA,
    payload: {
        filtro,
        tipoBusqueda
    }
});

/*
*Buscador de elementos del usuario logeado
*filtro: cadena a buscar
*tipoBusqueda: expediente, arquitectos, promotores
*/
export const fetchBuscador = (filtro,tipoBusqueda) => 
async (dispatch) => {
    let temp='';
    let temp2 = '';
    if(filtro!=null){
        temp=filtro;
    }
    if (tipoBusqueda != null) {
        temp2 = filtro;
    }
    else{
        temp2='expedientes';
    }
   
    dispatch(fetchFiltroUsuario(temp, temp2));
    await getBuscador(temp,tipoBusqueda).then((data) => {
       dispatch(fetchDataResults(data,tipoBusqueda));
    })
        .catch(
        () => fetchErrorExpediente({ error: 'Algo ha salido mal en la busqueda'})
    );
};




/*
*Obtiene la estructura documental de un trabajo
*id_expediente
*idtrabajo
*/
export const fetchEstructuraDocumentalTrabajo = (id_expediente, idtrabajo) => 
(dispatch) => {
   
    
    dispatch(fetchInit());
    getEstructuraDocumental(id_expediente,idtrabajo).then((expedientes) => {
        
       
        dispatch(fetchSuccessTrabajo(expedientes));
       
    })
        .catch(
        () => fetchErrorExpediente({ error: 'Algo ha salido mal'})
    );
};
/*
*obtiene los datos generales de un expediente
*id_expediente
*/
export const fetchExpedienteDatosGeneral = (id_expediente) => 
(dispatch) => {
        
    getExpedienteDatosGeneral(id_expediente).then((expedientes) => {
       
        dispatch(fetchSuccesExpediente(expedientes));
    })
        .catch(
        () => fetchErrorExpediente({ error: 'Algo ha salido mal'})
    );
};
/*
*obtiene los datos generales de un expediente
*id_expediente
*/
export const fetchExpedienteTrabajos= (id_expediente) => 
(dispatch) => {
      
        GettrabajosExpediente(id_expediente).then((trabajos) => {
      
        dispatch(fetchSuccesTrabajosExpediente(trabajos));
    })
        .catch(
        () => fetchErrorExpediente({ error: 'Algo ha salido mal'})
    );
};



export const validateAddress =  (id_ubicacion) =>
    async (dispatch) => {
        try {
            let response = await getValidateAddress(id_ubicacion);
            response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
                dispatch(fetchErrorExpediente(response.data))
                :
                dispatch(fetchAddress(response.data, id_ubicacion))
        }catch (error) {
            dispatch(fetchErrorExpediente(formatMenssage(error.message)));
        }

};

export const updateAddress = (address) =>
    (dispatch) => {
        dispatch(fetchUpdateAddress(address));
    }

/*
*
*Obtiene los expedientes de un usuario logeado y con token
*
*/
export const fetchexpedientesUser = () => 

(dispatch) => {
    expedientesuser().then((response) => {
      
        dispatch(fetchSuccess(response));
    })
        .catch(
        () => fetchErrorExpediente({ error: 'Algo ha salido mal'})
    );
};
/**
 * Insertar nuevo expediente con emplazamientos
 * @param data
 * @returns {Function}
 */
export const postUbicacion = (data) =>
 async dispatch => {
    try {
        let response = await postNuevoExpediente(data);
        response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0 ?
            dispatch(fetchErrorExpediente(response))
            :
            dispatch(fetchExpedientSave(response))
    }catch (error) {
        dispatch(fetchErrorExpediente(formatMenssage(error.message)));
    }
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
               
              dispatch(fetchSuccesTrabajoDatosgenerales(DatosTrabajo));
                      })
              .catch(
              () => fetchErrorExpediente({ error: 'Algo ha salido mal'})
          );
      };


const setExpediente = payload => ({ type: types.SET_EXPEDIENTE_SELECTED, payload });
const setExpedienteSelected = payload => ({ type: types.SET_EXPEDIENTE_SELECTED_DATOS, payload });


export const fetchSuccesTrabajoDatosgeneralesSelected = (data) => ({
    type: types.SET_EXPEDIENTE_SELECTED_DATOS_TRABAJO,
    payload: data
});
export const fetchDatosExpeFichaTrabajo = (datos) => ({
    type: types.SET_EXPEDIENTE_SELECTED_DATOS_TRABAJOFICHA,
    payload: datos
});
// export const fetchSuccesdatosExpSeleccionado = (datos) => ({
    
//     type: types.SET_EXPEDIENTE_SELECTED_DATOS_GENERALES,
//     payload: datos
// });

export const setSelectedExpediente = payload => {

    const {id_expediente, id_Trabajo} =payload;

          return dispatch =>{
            dispatch(setExpediente(payload));
            dispatch(setExpedienteSelected(payload));
          }
       
    
};
export const setSelectedExpedienteTo = (datos) => 
  
    (dispatch) =>{
       
     //let datos =[id_expediente,id_Trabajo]
        //dispatch(fetchSuccesdatosExpSeleccionado(datos));
       

        dispatch(fetchDatosExpeFichaTrabajo(datos))
        getTrabajoeDatosGenerales(datos.Id_Expediente,datos.Id_Trabajo).then((data) =>{               
               
                   
                 dispatch(fetchSuccesTrabajoDatosgeneralesSelected(data));
                
                })
                 .catch(
              ()=> fetchErrorExpediente({ error: 'Algo ha salido mal'})
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
         
                      })
              .catch(
              () => fetchErrorExpediente({ error: 'Algo ha salido mal'})
          );
      };

export const fetchelimardelatabla = (nodos,parametro) => ({
    
        type: types.ELIMINAR_TABLA,
        payload:[nodos, parametro] 
    });

export const elimardelatabla = (nodos, referencias)=> (dispatch) => {
       
        dispatch(fetchelimardelatabla(nodos,referencias)); 
    };

/**Acciones para manejar la seccion de promotores */
/**1- Limpiar la búsqueda */
export const dispatchLimpiarBusquedaPromotores = () => (dispatch) =>{
    dispatch({
        type: types.LIMPIAR_BUSQUDA,
        payload: []
    })
}

/**2- Adicionar promotor */
export const dispatchAddPromotor = (promotor) => (dispatch) =>{
    dispatch({
        type: types.ADD_PROMOTOR,
        payload: promotor
    })
}

/**Editar promotor */
export const dispatchEditPromotor = (promotor) => (dispatch) =>{
    dispatch({
        type: types.EDIT_PROMOTOR,
        payload: promotor
    })
}

/**Eliminar un promotor */
export const dispatchDeletePromotor = (nif) => (dispatch) =>{
    dispatch({
        type: types.DELETE_PROMOTOR,
        payload: nif
    })
}

