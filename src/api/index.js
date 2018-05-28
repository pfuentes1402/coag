import ordertree from "../helpers/orderTree";
const BASE_PATH = "http://servicios.coag.es/api";

/*
 *Proporciona la extructura documental de un trabajo
 * Parametros 
 *    id_expediente
 *    idtrabajo
 */

export const getEstructuraDocumental = (id_expediente,idtrabajo) =>
  fetch(`${BASE_PATH}/EstructuraDocumental/${id_expediente}/${idtrabajo}`)
    .then(response => {
      return response.json();
    })
    .then(resultado => {
      let ordenado = ordertree(resultado);

      return ordenado;
    });
/*
 *Proporciona los datos generales de un expediente
 * Parametros 
 *    id_expediente
 */


    export const getExpedienteDatosGeneral = id_expediente =>
  fetch(`${BASE_PATH}/expedientes/${id_expediente}`)
    .then(response => {
     
      return response.json();
    })
    .then(resultado => {
           
      return resultado;
    });


/*
 *Proporciona los grupos temáticos de un trabajo
 * Parametros 
 *    id_grupo
 */


export const getTiposTrabajo = id_grupo =>
fetch(`${BASE_PATH}/Tipos/Guia/GruposTematicos/${id_grupo}`)
  .then(response => {
    return response.json();
  })
  .then(resultado => {
    return resultado;
  });


/*
 *Proporciona los tipos de trámite de un trabajo
 */

export const getTiposAutorizacionMunicipal = () =>
fetch(`${BASE_PATH}/Tipos/Guia/Tiposautorizacionmunicipal/`)
  .then(response => {
    return response.json();
  })
  .then(resultado => {
    return resultado;
  });


/*
 *Valida una dirección a traves de su referencia catastral
 * Parametros 
 *    ref_catastral
 */


export const getValidateAddress = ref_catastral =>
  fetch(`${BASE_PATH}/DatosCatastro/${ref_catastral}`)
  
    .then(response => {
      return response.json();
    })
    .then(resultado => {

      return resultado;
    });

/*
 *Graba un nuevo expediente
 * Parametros 
 *    data->Datos que conforman un nuevo expediente
*/
    export const postNuevoExpediente = data =>
  
    fetch(`${BASE_PATH}/expedientes/`, {      
      method:'POST',     
      body:data,
            headers: new Headers({     
              'Accept': 'application/json',
              'Content-type': 'application/json'}),
    }).then(v => v.json())
      .then(resultado => {     
        
        return resultado;
      });
      
/*
 *Edita un expediente expediente
 * Parametros 
 *    data->Datos que conforman  el expediente
*/
 export const putExpediente = (data)=>

 
      fetch(`${BASE_PATH}/expedientes/`, {
        
        method:'PUT',     
        body:data,
              headers: new Headers({     
                'Accept': 'application/json',
                'Content-type': 'application/json'}),      
             
       
      }).then(v => v.json())
        .then(resultado => {
        
          return resultado;
        });
  
      
    