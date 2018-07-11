import React from 'react';
import { connect } from 'react-redux';
import {fetchEstructuraDocumentalTrabajo, fetchExpedienteDatosGeneral, fetchExpedienteSelected,fetchSelectedExpediente} from '../../actions/expedientes/index';

import "./styles.css";






const Componentelateral = ({selectedExpFromstore, trabajos, onSelectedLevel,fetchSelectedExpediente, expedientearbol,expedientes,fetchEstructuraDocumentalTrabajo,fetchExpedienteDatosGeneral,fetchExpedienteSelected, dataArbol})=>{
    const handleClickLateral = trabajo =>{
      console.log('Trabajo tras click');
      console.log(trabajo);
        onSelectedLevel(trabajo);
        fetchExpedienteSelected(trabajo);  
        fetchEstructuraDocumentalTrabajo(trabajo.Id_Expediente,trabajo.Id_Trabajo);
    };
    const handleClickLateralEXp = trabajo =>{
        onSelectedLevel(trabajo.Expediente);
        fetchExpedienteSelected(trabajo.Expediente);       
        //fetchExpedienteDatosGeneral(selectedExpFromstore);
       
        //fetchEstructuraDocumentalTrabajo(trabajo.Id_Expediente,trabajo.Id_Trabajo);
    };
    const click = datos=>{
    
        fetchExpedienteDatosGeneral(datos.Id_Expediente);
        fetchSelectedExpediente(datos);    
       
    }




    const strToComponentExp = expedientes =>(
        
        expedientes.map((expediente,i) =>(
           
            <div className="Expediente" key={i} onClick={()=>click(expediente)}>
                <div key={i}>{expediente.Id_Expediente}</div>
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
    expedientearbol: state.expedientes.expedienteData.Expediente?state.expedientes.expedienteData.Expediente[0]:"",
    expedientes: state.expedientes.expedientes || "",     
    dataArbol: state.expedientes.arbolEstructuraTrabajoRefactor[0],
    selectedExpFromstore: state.seleccionado.selectedExp?state.seleccionado.selectedExp:"",
    trabajos: state.expedientes.expedienteData? state.expedientes.expedienteData.Trabajos:[],
  });




export default connect(mapStateToProps,{fetchEstructuraDocumentalTrabajo, fetchExpedienteDatosGeneral, fetchExpedienteSelected,fetchSelectedExpediente})(Componentelateral);
