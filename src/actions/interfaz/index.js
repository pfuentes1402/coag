
import * as types from './types';



export const  fetchMuestraModal = (id) =>

    (dispatch) => {
    console.log('llega al reducer de interfaz')
    console.log(id)
        dispatch({
        type: types.FETCH_SHOW_MODAL,
        payload:id
        }); 
    };
export const  fetchocultaModal = () =>

    (dispatch) => {
    console.log('llega al reducer de interfaz')
        dispatch({
        type: types.FETCH_HIDE_MODAL,
        
        }); 
    };

    export const fetchCambiaStadoModal = (data) => ({
        type: types.CAMBIAESTADOMODAL,
        payload: false
    });
    export const fetchCambiaStadoModalFalse = (data) => ({
        type: types.OCULTACAMBIAESTADOMODAL,
        payload: false
    });
