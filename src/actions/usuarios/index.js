import { funcionForma, getToken, getultimosTrabajos, getExpedienteSuscepNuevoTrabajo } from '../../api';
import { fetchCambiaStadoModal } from '../../actions/interfaz/index';
import { fetchErrorExpediente, formatMenssage } from '../../actions/expedientes/index';
import * as types from './types';
import { PURGE } from 'redux-persist';

export const fetchInit = () => ({
    type: types.FETCH_EXPEDIENTES_INIT
});
export const fetchSuccessusuario = (data) => (
    {
        type: types.FETCH_DATOSDEUSUARIO_SUCCESS,
        payload: data
    });

export const fetchError = (error) => ({
    type: types.FETCH_EXPEDIENTES_ERROR,
    payload: error
});


export const fetchLoginExito = (data) => ({
    type: types.FETCH_LOGIN_SUCCESS,
    payload: data
});
export const fetchRefresh = (data) => ({
    type: types.REFRESH_TOKEN_,
    payload: data
});
export const fetchUltimosTrabajos = (data) => ({
    type: types.ULTIMOSTRABAJOS,
    payload: data
});
export const CambiaSelect = (data) => ({
    type: types.CAMBIASELECT,
    payload: data
});
export const confUsuarioActualizada = (data) => ({
    type: types.NUEVA_CONF_USUARIO,
    payload: data
});

export const fetchLanguage = (language) => (
    {
        type: types.FETCH_LANGUAGE,
        payload: language
    });

export const fetchSelect = (data) =>
    (dispatch) => {

        dispatch(CambiaSelect(data));
    };
export const fetchCambiaIdioma = (data) =>
    (dispatch) => {

        dispatch(confUsuarioActualizada(data));
    };

export const loading = (isLoading) => (
    {
        type: types.FETCH_LOADING,
        payload: isLoading
    });

export const fetchLoading = (isLoading) =>
    async (dispatch) => {
        dispatch(loading(isLoading));
    }


export const errorLogin = (message) => (
    {
        type: types.FETCH_LOGIN_FAIL,
        payload: message
    });

export const fetchUserLogin = (data, props) =>
    async (dispatch) => {
        try {
            let response = await funcionForma(data);
            if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                dispatch(fetchErrorExpediente(response));
                dispatch(errorLogin(response.MensajesProcesado[0].Mensaje));
            }
            else {
                let cienteClave = response.headers ? response.headers.clienteclave : '';
                let clienteid = response.headers ? response.headers.clienteid : '';

                if (cienteClave && clienteid) {
                    await localStorage.setItem('clienteclave', cienteClave);
                    await localStorage.setItem('clienteid', clienteid);
                    let token = await getToken();
                    if (token.status === 200) {
                        dispatch(fetchLoginExito(response));
                        await localStorage.setItem('user', JSON.stringify(response.data.DatosUsuarioValidado[0]));
                        props.history.push("/")
                    } else {
                        dispatch(fetchErrorExpediente(formatMenssage('Error de autenticación')));
                    }
                }
                else {
                    dispatch(fetchErrorExpediente(formatMenssage('Headers error')));
                }
            }

        } catch (error) {
            dispatch(fetchErrorExpediente(formatMenssage(error.message)));
        }
    }



export const purgarStore = () =>

    (dispatch) => {

        dispatch({
            type: PURGE,
            key: "root",
            result: () => null
        });

    };
export const goHome = () =>

    (dispatch) => {

        dispatch({
            type: types.BORRASELECTED,

        });

    };
export const goExpedientesUser = () =>

    (dispatch) => {

        dispatch({
            type: types.GOEXPEDIENTES,
        });

    };
export const gotrabajos = () =>

    (dispatch) => {

        dispatch({
            type: types.GOTRABAJOS,
        });

    };

/*
*Obtiene los expedientes de usuario (Datos dummy desde el api)(Debajo esta la final)

export const getTrabajos = () => 
(dispatch) => {    
let data = getultimosTrabajos();
     dispatch(fetchUltimosTrabajos(data));
};
*/

export const getTrabajos = () =>
    async (dispatch) => {
        try {
            let response = await getultimosTrabajos();
            response.MensajesProcesado && response.MensajesProcesado.length > 0
                ? dispatch(fetchErrorExpediente(response))
                : dispatch(fetchUltimosTrabajos(response));

        } catch (error) {
            dispatch(fetchErrorExpediente(formatMenssage(error.message)));
        }
    };


/*
*Acciones del modal hacia sus reducers
*/
export const fetchExpedientesSusceptibles = (data, id) => ({
    type: types.EXPEDIENTESSUSCEPTIBLESTRABAJO,
    payload: { data, id }
});
export const fetchExpedientesTrabajosTest = (data, id) => ({
    type: types.ACCIONESTRAMITARNUEVOTRABAJO,
    payload: { data, id }
});
export const fetchSolicitarLoa = (data, id) => ({
    type: types.ACCIONESSOLICITARLOA,
    payload: { data, id }
});
export const fetchSolicitarLi = (data, id) => ({
    type: types.ACCIONESSOLICITARLI,
    payload: { data, id }
});
export const fetchConvertirDigital = (data, id) => ({
    type: types.ACCIONESCONVERTIRDIGITAL,
    payload: { data, id }
});
export const fetchCesarExpediente = (data, id) => ({
    type: types.ACCIONESCESAREXPEDIENTE,
    payload: { data, id }
});


/*
*Obtiene los expedientes susceptibles de tramitar trabajo (Datos dummy desde el api)
*/
export const fetchSuscepAcciones = (id) =>
    (dispatch) => {
        let data = "";
        switch (id) {
            case 0:
                data = getExpedienteSuscepNuevoTrabajo(id);
                dispatch(fetchExpedientesSusceptibles(data, id));
                break;
            case 1:
                dispatch(fetchExpedientesTrabajosTest(data, id));
                break;
            case 2:
                dispatch(fetchSolicitarLoa(data, id));
                break;
            case 3:
                dispatch(fetchSolicitarLi(data, id));
                break;
            case 4:
                dispatch(fetchConvertirDigital(data, id));
                break;
            case 5:
                dispatch(fetchCesarExpediente(data, id));
                break;
            default:
        }
        dispatch(fetchCambiaStadoModal());


    };



export const setSelected = (data) =>
    (dispatch) => {
        dispatch(fetchsetSelected(data));
    };

export const fetchsetSelected = (data) => ({
    type: types.SELECTAGENTTOADD,
    payload: data
});
