import React, {Component} from 'react';
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import TramitacionesCurso from './../Tramitaciones/TramitacionesCurso';
import './styles.css';





class AccionesExistentes extends Component { 

    render() {
     
        return (
            <div>
            <Container className="full">
                <Row className="principal">                   
                                                                 
                 
                    <Col xs="12" sm="12">
                        
                        <div className='divderecha'>
                        <p>Acciones directas en expedientes existentes</p>
                                               
                       
                        </div>
                        
                    </Col>     
                          
                </Row>
                
            </Container>
        </div>
        );
    }
}




const mapStateToProps = state => ({
  
  });


  
  

export default connect(mapStateToProps,{})(AccionesExistentes);


