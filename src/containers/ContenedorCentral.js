import React from 'react';
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';

import OverViewComponent from './../components/OverViewComponent/OverViewComponent';
import './styles.css';   

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