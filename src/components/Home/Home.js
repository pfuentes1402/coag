import React, {Component} from 'react';
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';





class ContenedorExpedientes extends Component {

 
  
   
  



    render() {
      
        return (
            <div>
            <Container className="full">
                <Row className="principal">
                    
                                                                 
                    <Col xs="6" sm="6">
                        <div className='divderecha'>                           
                            <p>home</p>
                        </div>   
                        <div className='divderecha'>             
                              
                                
                        </div>
                    </Col>
                    <Col xs="6" sm="6">
                        <div className='divderecha'>
                        
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
   
   
    
   
  });


  
  

export default connect(mapStateToProps,{})(ContenedorExpedientes);


