import { history } from './hidtory';
import persistor from './../index';

/*
*
*Elimina los datos cuando te deslogeas  de la local store y del persist de redux-persist
*
**/
export const handleLoggout = () =>{
   
    localStorage.clear();
    persistor.purge();    
    history.push('/');
  }