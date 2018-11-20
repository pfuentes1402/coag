import React, { Component } from "react";
import { Collapse } from "reactstrap";
import { connect } from "react-redux";
import {Card,  CardHeader, CardText,ListGroupItem } from 'reactstrap';
import TrabajoElemto from './TrabajoElemto'
import ContenedorExpediente from "../ComponenteLareral/ContenedorExpediente";
import {
  setSelectedExpedienteTo,
  fetchEstructuraDocumental
} from "../../actions/expedientes";

import "./styles.css";



class Expandible extends Component {



  render() {  


      const renderTrabajos = trabajos =>(

          trabajos ?
        trabajos.map((trabajo,i) =>(
       
        <ListGroupItem className="file" key={i} >
         
         
            <TrabajoElemto data={trabajo} />
                          
        </ListGroupItem>  
    )) : ""

);

     
    return (
    
      <Card>
      
          <CardHeader>
              {/* <span>{this.props.datosExpediente.Titulo_Documento}</span> */}
              <span>00001 Viviendas en calle aragon</span>
          </CardHeader>
     
      <CardText tag="div" >
          <div className={`ficha`}>                
             <div>
             {renderTrabajos(this.props.trabajos)}
             </div>
          </div>
      </CardText>

  </Card>

   
    );
  }
}

Expandible.defaultProps = {
  trabajos: []
};

const mapStateToProps = state => ({
 //datosExpediente:state.seleccionado.expedienteSeleccionado.Expediente || '',
 trabajos:state.seleccionado.trabajosExpedienteSeleccionado || '',
});

export default connect(
  mapStateToProps,
  { setSelectedExpedienteTo, fetchEstructuraDocumental }
)(Expandible);
