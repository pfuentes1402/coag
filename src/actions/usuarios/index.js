import { getDatosUsuario, funcionForma, getToken } from '../../api';
import { history } from '../../helpers/hidtory';
import { withRouter } from "react-router-dom";
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

   



   /*
*Obtiene los expedientes de usuario (Datos dummy desde el api)
*/
// export const fetchDatosUsuario = (id_usuario) => 
// dispatch => {   
   
//     console.log('fetchDatosUsuario');
//     let data = getDatosUsuario(id_usuario)
//     //console.log(data);
//         dispatch(fetchSuccessusuario(data));
// };
//(dispatch) => {    
  //  dispatch(fetchInit());
    //getDatosUsuario(id_usuario).then((datos) => {
        
    //    dispatch(fetchSuccessusuario(datos));
       
  //  })
   //     .catch(
    //    () => fetchError({ error: 'Algo ha salido mal'})
   // );
