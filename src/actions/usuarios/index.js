import { getDatosUsuario, funcionForma } from '../../api';
import { history } from '../../helpers/hidtory';
import { withRouter } from "react-router-dom";
import * as types from './types';

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


export const fetchLoginExito = (data) => (  
    
    {
        
    type: types.FETCH_LOGIN_SUCCESS,
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
        console.log(data);
           if(data=== 401){
               console.log('respuesta 401 desde el server');
               dispatch(errorLogin("login: "+data)); 
           }else{
            
            dispatch(fetchLoginExito(data)); 
        history.push('/');
           }
                     
          
       })
            .catch(
               
            // () => errorLogin(data)
        );
   };

   export const  loginAndRedirect = (data) =>
     dispatch => {
         dispatch(fetchUserLogin(data))
     
  };


   /*
*Obtiene los expedientes de usuario (Datos dummy desde el api)
*/
export const fetchDatosUsuario = (id_usuario) => 
dispatch => {   
   
    console.log('fetchDatosUsuario');
    let data = getDatosUsuario(id_usuario)
    //console.log(data);
        dispatch(fetchSuccessusuario(data));
};
//(dispatch) => {    
  //  dispatch(fetchInit());
    //getDatosUsuario(id_usuario).then((datos) => {
        
    //    dispatch(fetchSuccessusuario(datos));
       
  //  })
   //     .catch(
    //    () => fetchError({ error: 'Algo ha salido mal'})
   // );
