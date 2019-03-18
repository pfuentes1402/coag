import { history } from './hidtory';
import persistor from './../index';
import {Switch, Route} from 'react-router-dom';

/*
*
*Elimina los datos cuando te deslogeas  de la local store y del persist de redux-persist
*
**/
export const handleLoggout = async () =>{
    localStorage.clear();
    await persistor.purge();    
    //history.push('/login');
    window.location = "/login";
}