import React, { Component } from 'react';
import { Card,  CardHeader, CardText } from 'reactstrap';
import AgentsTableWorks from '../Trabajos/AgentTableWorks';
import { connect } from 'react-redux';


class TrabajosContainer extends Component {

    render() {      
        return (
            <div>
                 <Card>
                   <CardHeader>{this.props.titulo}</CardHeader>                
                        <CardText> <AgentsTableWorks data={ this.props.datosAgentes}/> </CardText>
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