
import * as types from './types';



export const  fetchMuestraModal = () =>

    (dispatch) => {
    console.log('llega al reducer de interfaz')
        dispatch({
        type: types.FETCH_SHOW_MODAL,
        
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
