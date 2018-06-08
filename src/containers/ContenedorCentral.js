import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes,
    fetchTrabajoDatosGeneral, fetchEstructuraDocumentalTrabajo, setSelectedExpediente} from './../actions/expedientes';

import OverViewComponent from './../components/OverViewComponent/OverViewComponent';
import './styles.css';   

import {Divider} from 'material-ui'
import ContenedorExpedientes from './ContenedorExpedientes';
import ContenedorTrabajos from './ContenedorTrabajos';


const RenderContenedorcentral =() =>{
    return (<ContenedorTrabajos/>)
}
const RenderContenedorcentrales =() =>{
    return (<ContenedorExpedientes/>)
}

const Contenedorcentral= ({contenidoExp}) =>(

    <div>
    {contenidoExp === 'Trabajo' ? RenderContenedorcentral():RenderContenedorcentrales()}
    
    </div>
)





export default Contenedorcentral;