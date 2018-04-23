import ordertree from "../helpers/orderTree";
const BASE_PATH = 'http://servicios.coag.es/api';

export const getExpedientes = () => fetch(`${BASE_PATH}/EstructuraDocumental/688685/2`).then((response) => {
  return response.json();
}).then((temp) => {
  ordertree(temp).then((response)=>{
    console.log(response);
    return response;
  })
  
});
 
 
 
 
  
 
 
 
 
 
 
 
  //var exp = response.json();
 // return exp;


