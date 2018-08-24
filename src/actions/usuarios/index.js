import {  funcionForma, getToken, getultimosTrabajos, getExpedienteSuscepNuevoTrabajo } from '../../api';
import { fetchCambiaStadoModal } from '../../actions/interfaz/index';
import { history } from '../../helpers/hidtory';
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
   payload:data
});

export const fetchSelect = (data)=>
    (dispatch) => {
        console.log("llega a fetchselect");
            dispatch(CambiaSelect(data));
}; 





export const errorLogin = (data) => (  
   
    {
        
    type: types.FETCH_LOGIN_FAIL,
    payload: data
});





   export const fetchUserLogin = (data) => 
   (dispatch) => {
       funcionForma(data).then((data) => {
           if(data=== 401){
               console.log('respuesta 401 desde el server');
         
               dispatch(errorLogin("login: "+data)); 
           }else{
               let cienteClave =data.headers ?data.headers.clienteclave : ''; 
               let clienteid =data.headers ? data.headers.clienteid : ''; 
              
               if(cienteClave && clienteid){
                    localStorage.setItem('clienteclave',cienteClave);
                    localStorage.setItem('clienteid',clienteid);
                    getToken().then((response) => {
                        if(response.status === 200){
                            data.data.token= response.headers.token;
                            localStorage.setItem('token', response.headers.token);
                            dispatch(fetchLoginExito(data));
                            localStorage.setItem('user', JSON.stringify(data.data.DatosUsuarioValidado[0]));            
                            history.push('/');
                        }else{
                            data.data.token ='';
                        }
                    });
                }
           }
       })
            .catch(
               
            // () => errorLogin(data)
        );
   };

   export const  purgarStore = () =>

        (dispatch) => {
            console.log('purgar');
            dispatch({
            type: PURGE,
            key: "root",   
            result: () => null        
    }); 
        
    };
   export const  goHome = () =>

        (dispatch) => {
           
            dispatch({
            type: types.BORRASELECTED,
             
    });   
        
    };
   export const  goExpedientesUser = () =>

        (dispatch) => {
          
            dispatch({
            type: types.GOEXPEDIENTES,             
    });   
        
    };

   



   /*
*Obtiene los expedientes de usuario (Datos dummy desde el api)
*/
export const getTrabajos = () => 
dispatch => {   
   
    console.log('fetchDatosUsuario');
    let data = getultimosTrabajos();
    //console.log(data);
        dispatch(fetchUltimosTrabajos(data));
};

/*
*Acciones del modal hacia sus reducers
*/
export const fetchExpedientesSusceptibles = (data,id) => ({
    type: types.EXPEDIENTESSUSCEPTIBLESTRABAJO,
    payload: {data,id}
});
export const fetchExpedientesTrabajosTest = (data,id) => ({
    
    type: types.ACCIONESTRAMITARNUEVOTRABAJO,
    payload:  {data,id}
});
export const fetchSolicitarLoa = (data,id) => ({    
    type: types.ACCIONESSOLICITARLOA,
    payload:  {data,id}
});
export const fetchSolicitarLi = (data,id) => ({    
    type: types.ACCIONESSOLICITARLI,
    payload:  {data,id}
});
export const fetchConvertirDigital = (data,id) => ({    
    type: types.ACCIONESCONVERTIRDIGITAL,
    payload:  {data,id}
});
export const fetchCesarExpediente = (data,id) => ({    
    type: types.ACCIONESCESAREXPEDIENTE,
    payload:  {data,id}
});


/*
*Obtiene los expedientes susceptibles de tramitar trabajo (Datos dummy desde el api)
*/
export const fetchSuscepAcciones = (id) => 
(dispatch) => {
    let data="";
    switch(id) {        
        case 1:
        data =getExpedienteSuscepNuevoTrabajo(id);           
        dispatch(fetchExpedientesSusceptibles(data,id));
            break;
        case 2:         
        dispatch(fetchExpedientesTrabajosTest(data,id));
            break;
        case 3:         
        dispatch(fetchSolicitarLoa(data,id));
            break;
        case 4:         
        dispatch(fetchSolicitarLi(data,id));
            break;
        case 5:         
        dispatch(fetchConvertirDigital(data,id));
            break;
        case 6:         
        dispatch(fetchCesarExpediente(data,id));
            break;
        default:
    }
    dispatch(fetchCambiaStadoModal());


};