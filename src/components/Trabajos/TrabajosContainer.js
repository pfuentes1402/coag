import React, { Component } from 'react';
import { Card,  CardHeader, CardText } from 'reactstrap';
import AgentsTableWorks from '../Trabajos/AgentTableWorks';
import { connect } from 'react-redux';


class TrabajosContainer extends Component {

    render() {      
        return (
                <div className="cajaAgentes">
                    <Card>
                    <CardHeader className="tituloTabla">{this.props.titulo}</CardHeader>                
                            <CardText tag="div"> <AgentsTableWorks data={ this.props.datosAgentes}/> </CardText>
                    </Card> 
                </div>
        );
    }
}




TrabajosContainer.defaultProps = {
    
    loading: false
  };
const mapStateToProps = state => ({
    //datosAgentes:state.expedientes.datosAgentes ? state.expedientes.datosAgentes:""
   
  });
 

export default connect(mapStateToProps,)(TrabajosContainer);