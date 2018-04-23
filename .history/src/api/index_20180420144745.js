import ordertree from "../helpers/ordertree";
const BASE_PATH = 'http://servicios.coag.es/api';

export const getExpedientes = () => fetch(`${BASE_PATH}/EstructuraDocumental/688685/2`).       .then((response) => {
  return response.json();
}).then((temp) => {
  ordertree(temp)
  
});
 
 
 
 
  
 
 
 
 
 
 
 
  //var exp = response.json();
 // return exp;


