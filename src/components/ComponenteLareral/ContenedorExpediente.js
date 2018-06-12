import React, { Component } from 'react';

import './styles.css';
import ContenedorTrabajo from './ContenedorTrabajo';

class ContenedorExpediente extends Component {
    render() {
        return (
            <div className="test"> 
            <div onClick={()=>this.props.OnhandleClickLateral()}>               
               <ContenedorTrabajo
               titulo= {this.props.titulo}/>               
            </div>
            </div>
        );
    }
}

ContenedorExpediente.propTypes = {

};

export default ContenedorExpediente;