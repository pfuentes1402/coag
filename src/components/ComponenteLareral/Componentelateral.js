import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExpedienteLevel from './ExpedienteLevel';
import Expandible from './Expandible';
import {fetchEstructuraDocumentalTrabajo, fetchExpedienteDatosGeneral, fetchExpedienteSelected} from '../../actions/expedientes/index';
import ConteArboles from './ConteArboles';
import {Divider} from 'material-ui'






const Componentelateral = ({selectedExpFromstore, trabajos, onSelectedLevel, expedientearbol,expedientes,fetchEstructuraDocumentalTrabajo,fetchExpedienteDatosGeneral,fetchExpedienteSelected, dataArbol})=>{
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
    const click = expedientes=>{        
        fetchExpedienteDatosGeneral(expedientes.Expediente);
        console.log(expedientes.Expediente);
        console.log('click expediente');
    }




    const strToComponentExp = expedientes =>(
        
        expedientes.map(expediente =>(
      <div onClick={()=>click(expediente)}>
      <div>{expediente.Expediente}</div>
            {/* <ConteArboles key={expediente.expediente}
            expedient={expediente.Expediente}
            data={trabajos}
            OnhandleClickLateral={()=>handleClickLateralEXp(expediente)}/> */}
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
    expedientes: state.user.data?state.user.data.Expedientes:"",     
    dataArbol: state.expedientes.arbolEstructuraTrabajoRefactor[0],
    selectedExpFromstore: state.seleccionado.selectedExp?state.seleccionado.selectedExp:"",
    trabajos: state.expedientes.expedienteData? state.expedientes.expedienteData.Trabajos:[],
  });




export default connect(mapStateToProps,{fetchEstructuraDocumentalTrabajo, fetchExpedienteDatosGeneral, fetchExpedienteSelected})(Componentelateral);
