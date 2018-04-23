/*const BASE_PATH = 'http://servicios.coag.es/api';

export const getExpedientes = () => fetch(`${BASE_PATH}/EstructuraDocumental/688685/2`).then((response) =>{
  var exp = response.json();
  return exp;
});*/

import ordertree from "../helpers/orderTree";
const BASE_PATH = 'http://servicios.coag.es/api';

export const getExpedientes = () => fetch(`${BASE_PATH}/EstructuraDocumental/688685/2`)
.then((response) => {
  console.log("datos antes del .json");
  console.log(response);
  return response.json();   
})
.then(resultado => {
  console.log("resultado antes de ordertree")
  console.log(resultado);

  let ordenado = ordertree(resultado) 
  console.log(ordenado);
     return ordenado;
});
 
 
 
  
 

