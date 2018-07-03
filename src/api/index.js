import store from './../index';
import ordertree from "../helpers/orderTree";
import axios from 'axios';

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
  fetch(`${BASE_PATH}/expedientes/${id_expediente}`,{
    method:'GET',     
    
          headers: new Headers({     
            
            'Token': 'hLpgkmZCcuV4G3Q5RoQ76+/nXDT7WMl+3NxoWKsM4AzUNkPBgf9j+aEQ+O7BNPd9robwsY0hYnsaCXMBO+yYUA=='}),
  }).then(response => {
    console.log('accesostore');
      console.log( store.getState().seleccionado.selectedExpediente);
     
      console.log();
      console.log('>>>>>>><<<<<<<<>>>>>><<<<<<');
     
      return response.json();
    })
    .then(resultado => {
           console.log(resultado);
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
 *Proporciona los tipos de trabajos permitidos de un tipo de obra y tipo de tramite
 */

export const getFasesTrabajos = (id_tipo_grupo, id_tipo_autorizacion) =>
fetch(`${BASE_PATH}/Tipos/Guia/Fasestrabajos/?id_tipo_grupo_tematico=${id_tipo_grupo}&id_tipo_autorizacion_municipal=${id_tipo_autorizacion}&idioma=1`)
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
   console.log('respuesta');
   console.log(response);
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
   console.log('getTrabajoeDatosGenerales api');
   console.log(response);
    return response.json();

  })
  .then(resultado => {
      
    return resultado;
  });


  export const funcionForma = (datos) => 
    //console.log(datos);
    axios.post('http://servicios.coag.es/api/login',     
    {
        
            Usuario: datos.usuario,
            password: datos.password
        
    })
    .then(response => {
      console.log('funcionForma');
      console.log(response);
       return response;  
       
    

});


 export function getDatosUsuario(id){   

  let data =  {
    Expedientes: [
      {
        Expediente: '688685 ',
        fecha: '05/06/2018',       
      },
      {
        Expediente: '683180',
        fecha: '05/06/2018',       
      },
      {
        Expediente: '685062',
        fecha: '05/06/2018',       
      },
      {
        Expediente: '693458',
        fecha: '05/06/2018',       
      },
    ],   
  }
   
  
    return data;
  }

 
  
  