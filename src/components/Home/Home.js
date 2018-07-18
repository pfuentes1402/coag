import React, {Component} from 'react';
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import TramitacionesCurso from './../Tramitaciones/TramitacionesCurso';
import './styles.css';





class ContenedorExpedientes extends Component {

 

    render() {
     
        return (
            <div>
            <Container className="full">
                <Row className="principal">                   
                                                                 
                 
                    <Col xs="12" sm="12">
                        
                        <div className='divderecha'>
                        <p>Tramitaciones en Curso <span className="colorAzul">({this.props.ultimostrabajos.Trabajos.length})</span> 
                        
                       </p>
                       
                        <TramitacionesCurso data={this.props.ultimostrabajos.Trabajos}  />
                        </div>
                        
                    </Col>     
                          
                </Row>
                <Row>
                <Col sm={{ size: '6' }}>
                        <div className='divderecha'>   
                           
                            <div className="expedientes">
                               
                            </div>
                            <div className="expedientes">
                                
                            </div>
                        </div>   
                    </Col>
                </Row>
            </Container>
        </div>
        );
    }
}




const mapStateToProps = state => ({
    ultimostrabajos:state.user.ultimostrabajos||'',
   
    
   
  });


  
  

export default connect(mapStateToProps,{})(ContenedorExpedientes);


