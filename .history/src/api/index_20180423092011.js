/*const BASE_PATH = 'http://servicios.coag.es/api';

export const getExpedientes = () => fetch(`${BASE_PATH}/EstructuraDocumental/688685/2`).then((response) =>{
  var exp = response.json();
  return exp;
});*/

import ordertree from "../helpers/orderTree";
const BASE_PATH = 'http://servicios.coag.es/api';
var exp;
export const getExpedientes = () => fetch(`${BASE_PATH}/EstructuraDocumental/688685/2`).then((response) => {
  return response;   
})
.then(resultado => {  
  console.log(resultado);
  let ordenado = ordertree(resultado) 
     exp = ordenado.json();
    
     return exp;
});
 
 
 
  
 

