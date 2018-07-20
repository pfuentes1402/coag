import React, {Component} from 'react';
import {Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchocultaModal } from '../../actions/interfaz/index'

import './styles.css';





class Modalacciones extends Component { 

    render() {
     
       
        const handleclick = ()=>{    
            console.log("Cierra el modal");
            this.props.fetchocultaModal();
            
         }
      
  
        return (

            

            <div className="muestrate">
            <Container className="full">
                <Row className="principal">                   
                                                                 
                 
                    <Col xs="12" sm="12">                        
                        <div className='divderecha'>
                       <button onClick={()=>handleclick()}>X</button>  
                        
                        
                        </div>
                        <div>
                        
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


  
  

export default connect(mapStateToProps,{ fetchocultaModal })(Modalacciones);


