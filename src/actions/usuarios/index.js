import { getDatosUsuario } from '../../api';

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
