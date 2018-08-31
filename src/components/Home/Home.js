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
                        {/* <p>Tramitaciones en Curso <span className="colorAzul">({this.props.ultimostrabajos.Trabajos.length})</span>  */}
                        
                       {/* </p> */}
                       
                        <TramitacionesCurso data={this.props.ultimostrabajos.Trabajos} lang={this.props.idioma} />                      
        
                      
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
    idioma:state.localize.languages[0].active===true?'es':'gal',
  });


  
  

export default connect(mapStateToProps,{})(ContenedorExpedientes);


