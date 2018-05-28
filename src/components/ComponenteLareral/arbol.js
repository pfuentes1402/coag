import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ExpedienteLevel from './ExpedienteLevel';

const Arbol = ({expedientes, onSelectedArbol})=>{
    const handleArbolClick = expediente => {       
        onSelectedArbol(expediente);

    }

    const strTocomponent = expedientes =>(
        expedientes.map(expediente =>
        (
            <ExpedienteLevel
                key={expediente.key}
                expediente={expediente.name}
                OnExpedienteClick = {()=>handleArbolClick(expediente.name)}
                data={expediente.data} /> ))           
        
    
    );
}

Arbol.propTypes = {

};

export default Arbol;