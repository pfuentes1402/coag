import React from 'react';
import { connect } from 'react-redux';
import {fetchEstructuraDocumentalTrabajo, fetchExpedienteDatosGeneral, fetchExpedienteSelected,fetchSelectedExpediente} from '../../actions/expedientes/index';

import "./styles.css";






const Componentelateral = ({selectedExpFromstore, trabajos, onSelectedLevel,fetchSelectedExpediente, expedientes,fetchEstructuraDocumentalTrabajo,fetchExpedienteDatosGeneral,fetchExpedienteSelected})=>{
  
    const click = datos=>{
    
        fetchExpedienteDatosGeneral(datos.Id_Expediente);
        fetchSelectedExpediente(datos);    
       
    }




    const strToComponentExp = expedientes =>(
        
        expedientes.map((expediente,i) =>(
           
            <div className="Expediente" key={i} onClick={()=>click(expediente)}>
                <div key={i}>{expediente.Id_Expediente}-{expediente.Titulo}</div>
            </div>  
        ))
    );

   

 

return (
    <div> 
        <div>         
            {strToComponentExp(expedientes)}
        </div>
        
    </div>
);

};

Componentelateral.defaultProps = {
 
    trabajos: [],
   
  };

const mapStateToProps = state => ({
   
    expedientes: state.expedientes.expedientes || [{}],
    selectedExpFromstore: state.seleccionado.selectedExp?state.seleccionado.selectedExp:"",
    trabajos: state.expedientes.expedienteData? state.expedientes.expedienteData.Trabajos:[],
  });




export default connect(mapStateToProps,{fetchEstructuraDocumentalTrabajo, fetchExpedienteDatosGeneral, fetchExpedienteSelected,fetchSelectedExpediente})(Componentelateral);
