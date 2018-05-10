import React, { Component } from 'react';
import { Card,  CardHeader, CardText } from 'reactstrap';
import AgentsTable from './ExpedientType/AgentsTable';
import { connect } from 'react-redux';

class ExpedientContainer extends Component {
    render() {
        return (
            <div>
                 <Card>
                   <CardHeader><span>{this.props.titulo}</span></CardHeader>    
                        <CardText> <AgentsTable data={this.props.propietarios}/> </CardText>
                </Card> 
            </div>
        );
    }
}




ExpedientContainer.propTypes = {
    
};

ExpedientContainer.defaultProps = {
    propietarios: [],   
    loading: false
  };
const mapStateToProps = state => ({
    propietarios:state.expedientes.expedienteData ? state.expedientes.expedienteData.ExpedientePropietarios:""
   
  });

export default connect(mapStateToProps,)(ExpedientContainer);