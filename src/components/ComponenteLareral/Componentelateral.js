import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExpedienteLevel from './ExpedienteLevel';
import Expandible from './Expandible';
import {fetchEstructuraDocumentalTrabajo} from '../../actions/expedientes/index';






const Componentelateral = ({trabajos, onSelectedLevel, expedientes, fetchEstructuraDocumentalTrabajo, dataArbol})=>{
    const handleClickLateral = trabajo =>{
      
        onSelectedLevel(trabajo);
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<');
        console.log(trabajo.Id_Expediente);
        fetchEstructuraDocumentalTrabajo(trabajo.Id_Expediente,trabajo.Id_Trabajo);
    };

    const strToComponent = trabajos =>(
        trabajos.map(trabajo =>
        (
           /* <ExpedienteLevel
                key={trabajo.key}
                expediente={trabajo.Titulo}
                OnhandleClickLateral={()=>handleClickLateral(trabajo)}
            />*/
            <Expandible key={trabajo.Fecha_Entrada}
            expediente={trabajo.Titulo}
            data={dataArbol}
            OnhandleClickLateral={()=>handleClickLateral(trabajo)}/>
        
        ))
    );
    console.log(dataArbol);

return (<div>
        <div className='bloque'><p>{expedientes.Id_Expediente}</p></div>
        {strToComponent(trabajos)}
        </div>);
};



const mapStateToProps = state => ({
    expedientes: state.expedientes.expedienteData.Expediente?state.expedientes.expedienteData.Expediente[0]:"",    
    dataArbol: state.expedientes.arbolEstructuraTrabajoRefactor[0],
  });




export default connect(mapStateToProps,{fetchEstructuraDocumentalTrabajo})(Componentelateral);
