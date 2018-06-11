import React, { Component } from 'react';
import TablaTrabajos from './TablaTrabajos';
import { connect } from 'react-redux';

import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';

class ListWorks extends Component {
    render() {
        return (    
            <Row>
                    <Col> 
                        <Card className="card-Trabajos">
                            <CardHeader>Trabajos</CardHeader>                                                                
                                <CardText  className="card-body-Trabajos"><TablaTrabajos data={this.props.trabajos}/></CardText>
                        </Card>
                    </Col>
             </Row>         
        );
    }
}



ListWorks.propTypes = {
   
};

ListWorks.defaultProps = {
    expedientedata: [],
  
  };
const mapStateToProps = state => ({
    trabajos: state.expedientes.expedienteData.Trabajos,
    
   
  });

export default connect(mapStateToProps,)(ListWorks);