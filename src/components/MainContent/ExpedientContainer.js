import React, { Component } from 'react';
import { Card,  CardHeader, CardText } from 'reactstrap';
import AgentsTable from './ExpedientType/AgentsTable';
import { connect } from 'react-redux';


class ExpedientContainer extends Component {


    render() {
      //console.log(this.props.datosAgentes);
        return (
            <div className="cajaAgentes">
                 <Card>
                   <CardHeader className="tituloTabla">{this.props.titulo}</CardHeader>                
                    <CardText tag="div">
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