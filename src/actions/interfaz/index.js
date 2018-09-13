
import * as types from './types';



export const  fetchMuestraModal = (id) =>

    (dispatch) => {
        let parametro ="";
        if (id!=null){
            parametro=id;
            console.log(id)
        }
    console.log('llega al reducer de interfaz')
   
        dispatch({
        type: types.FETCH_SHOW_MODAL,
        payload:parametro
        }); 
    };
export const  fetchocultaModal = () =>

    (dispatch) => {
    console.log('llega al reducer de interfaz')
        dispatch({
        type: types.FETCH_HIDE_MODAL,        
        }); 
    };
//Se usa para cerrar el modal al pulsar el boton cerrar
    export const fetchCambiaStadoModal = (data) => ({
        type: types.CAMBIAESTADOMODAL,
        payload: false
    });

//Se usa para cambiar el estado del loading al pulsar el boton cerrar
    export const fetchCambiaStadoModalFalse = (data) => ({
        type: types.OCULTACAMBIAESTADOMODAL,
        payload: false
    });
//Cambia contenido del modal a buscador    
    export const fetchCambiaStatoModalBuscador = ()=>({
        type:types.SHOWBUSCADOR,
    });
    export const fetchCambiaStatoModalAcciones = ()=>({
        type:types.SHOWACCIONES,
    });

 //Borra los datos del modal
 
 export const fetchResetResultsModal = () =>({
    type:types.FETCH_RESET_RESULT,
 })

 export const  buttonAdd = (parametro) =>

    (dispatch) => {
          
        dispatch({
        type: types.BUTTON_ADD,
        payload:parametro
        }); 
    };