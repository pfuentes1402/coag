import React, { Component } from 'react';
import { Card,  CardHeader, CardText } from 'reactstrap';
import AgentsTable from './ExpedientType/AgentsTable';
import { connect } from 'react-redux';


class ExpedientContainer extends Component {


    render() {
      console.log('ExpedienteContainer');
      console.log(this.props.datosAgentes);
      console.log('ExpedienteContainer');
        return (
            <div>
                 <Card>
                   <CardHeader>{this.props.titulo}</CardHeader>                
                    <CardText>
                        <AgentsTable data={this.props.datosAgentes}/>
                    </CardText>
                </Card> 
            </div>
        );
    }
}
ExpedientContainer.propTypes = {
    
};
ExpedientContainer.defaultProps = {
    
    loading: false
  };
const mapStateToProps = state => ({
    //datosAgentes:state.expedientes.datosAgentes ? state.expedientes.datosAgentes:""
   
  });
 

export default connect(mapStateToProps,)(ExpedientContainer);