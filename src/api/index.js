/*const BASE_PATH = 'http://servicios.coag.es/api';

export const getExpedientes = () => fetch(`${BASE_PATH}/EstructuraDocumental/688685/2`).then((response) =>{
  var exp = response.json();
  return exp;
});*/

import ordertree from "../helpers/orderTree";
const BASE_PATH = "http://servicios.coag.es/api";

export const getExpedientes = (id_expediente) =>
  fetch(`${BASE_PATH}/EstructuraDocumental/${id_expediente}/2`, {'Content-type' : 'application/json'})
    .then(response => {
      console.log("entra aqui");
      return response.json();
    })
    .then(resultado => {
      console.log("entra aqui 2");
      let ordenado = ordertree(resultado);
    
      return ordenado;
    });

    export const getValidateAdress = (e) =>   
    fetch(`${BASE_PATH}/DatosCatastro/${e}`)
      .then(response => {
        return response.json();
      })
      .then(resultado => {
        return resultado;
      });