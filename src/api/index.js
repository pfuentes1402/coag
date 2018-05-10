/*const BASE_PATH = 'http://servicios.coag.es/api';

export const getExpedientes = () => fetch(`${BASE_PATH}/EstructuraDocumental/688685/2`).then((response) =>{
  var exp = response.json();
  return exp;
});*/

import ordertree from "../helpers/orderTree";
import expedientetree from "../helpers/expedientetree";
const BASE_PATH = "http://servicios.coag.es/api";

export const getExpedientes = id_expediente =>
  fetch(`${BASE_PATH}/EstructuraDocumental/${id_expediente}/2`)
    .then(response => {
      return response.json();
    })
    .then(resultado => {
      let ordenado = ordertree(resultado);

      return ordenado;
    });

    export const getExpedienteDatosGeneral = id_expediente =>
  fetch(`${BASE_PATH}/expedientes/${id_expediente}`)
    .then(response => {
      console.log("Inicio del getExpedienteDatosGeneral");
      return response.json();
    })
    .then(resultado => {
      console.log("Fin del getExpedienteDatosGeneral");
      console.log(resultado);      
      return resultado;
    });

export const getValidateAdress = e =>

  fetch(`${BASE_PATH}/DatosCatastro/${e}`)
  
    .then(response => {
      return response.json();
    })
    .then(resultado => {

      return resultado;
    });

export const getExpediente = id_expediente =>
  fetch(`${BASE_PATH}/EstructuraDocumental/${id_expediente}`)
    .then(response => {

      return response.json();
    }).then(resultado => {

      let query='Trabajos'
      let ordenado = expedientetree(resultado.Trabajos);

      return ordenado;
    });
  

    export const postValidAdress = data =>
  
    fetch(`${BASE_PATH}/expedientes/`, {      
      method:'POST',     
      body:data,
            headers: new Headers({     
              'Accept': 'application/json',
              'Content-type': 'application/json'}),
    }).then(v => v.json())
      .then(resultado => {     
        console.log(resultado);
        return resultado;
      });
   

export const getExpedienteGeneral = id_expediente =>
  fetch(`${BASE_PATH}/expedientes/${id_expediente}`)
    .then(response => {
      return response.json();
    }).then(resultado => {
        console.log(resultado);
      return resultado;
    });
  


     /* export const putValidAdress = (data)=>

 
      fetch(`${BASE_PATH}/expedientes/`, {
        
        method:'PUT',     
        body:data,
              headers: new Headers({     
                'Accept': 'application/json',
                'Content-type': 'application/json'}),      
             
       
      }).then(v => v.json())
        .then(resultado => {
          console.log(resultado);
          return resultado;
        });*/
  
      
    