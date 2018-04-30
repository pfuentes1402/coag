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


   

    export const postValidAdress = ()=> 


 
    fetch(`${BASE_PATH}/expedientes/`, {
      
      method:'POST',     
      body: JSON.stringify({"Fecha_Entrada": "2018-03-16T13:21:37.443",      
              "Titulo":"Vivienda",
              "Expediente_Codigo_Estudio": "Test_18_149",  
              "Antecedente": "",
              "Observaciones": "",
              "Emplazamientos": [
              {"Calle": "LUGAR ARIÑO Polígono 0 Parcela 1 NC",  
                "Piso":"",
                  "Numero":"",
                "Id_Concello":15086,    
                "Codigo_Postal":"",  
                  "Georeferencia":""
                }
                ]  
                ,"IgnorarObservaciones":1
            }),
            headers: new Headers({     
              'Accept': 'application/json',
              'Content-type': 'application/json'}),      
           
     
    }).then(v => v.json())
      .then(resultado => {

        return resultado;
      });

    