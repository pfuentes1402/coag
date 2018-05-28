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

/*
 *Edita un expediente expediente
 * Parametros 
 *    data->Datos que conforman  el expediente
*/
export function getAgentesInfo(id_Agente){
 
 
let data =  {
  Arquitectos: [
    {
      nif: '76900827M',
      nombre: 'Pedro Martinez',
      porcentage: '60%',
    },
    {
      nif: '35782595X',
      nombre: 'Martin Alvarez Salgado',
      porcentage:  '20%',
    }
  ],
  Promotores: [
    {
      nif: '3578245544T',
      nombre: 'Joaquin Perez Salgado',
      porcentage:  '10%',
    },
    {
      nif: '233444266H',
      nombre: 'Juan Alvarez Sousa',
      porcentage:  '10%',
    }
  ]
}



  return data;
}


/*
 *Proporciona los datos generales de un expediente
 * Parametros 
 *    id_expediente
 */


export const test = id_expediente =>
fetch(`${BASE_PATH}/expedientes/${id_expediente}`)
  .then(response => {
   
    return response.json();
  })
  .then(resultado => {
         
    return resultado;
  });

  /*
 *Proporciona los datos generales de un Trabajo
 * Parametros 
 *    id_expediente
 *    id_Trabajo
 */
export const getTrabajoeDatosGenerales = (id_expediente,id_Trabajo) =>
fetch(`${BASE_PATH}/expedientes/${id_expediente}/trabajos/${id_Trabajo}`)
  .then(response => {
   
    return response.json();

  })
  .then(resultado => {
      
    return resultado;
  });




  
   
    