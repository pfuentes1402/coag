import React, {Component} from 'react';
import {Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchocultaModal, fetchCambiaStadoModalFalse } from '../../actions/interfaz/index'

import './styles.css';





class Modalacciones extends Component { 

    render() {
     
       
        const handleclick = ()=>{    
            console.log("Cierra el modal");
            this.props.fetchocultaModal();
            this.props.fetchCambiaStadoModalFalse();
            
         }
      

         const loading =() =>{
            return (<div>
                    <p>Loading...</p>
            </div>)
        }
        const RenderComponents=()=>{
            return (
                <div>
                    <div >
                        <p>Propiedad titulo desde redux</p>
                        <p>Propiedad descripcion desde redux </p>
                    </div>
                    <div>
                        <p>Input</p>
                    </div>
                    <button>Cancelar</button>
                    <button>Buscar</button>

                    <div>
                        <div>
                            <p>Tabla de resultados</p>
                        </div>
                    
                    </div> 
                </div>
        )
           
        }

  
        return (

            

            <div className="muestrate">
                <Container className="full">
                    <Row className="principal">                   
                                                                    
                    
                        <Col xs="12" sm="12">                        
                            <div className='divderecha'>
                        <button onClick={()=>handleclick()}>X</button>
                            
                             {this.props.loading === true ?loading(): RenderComponents()}
                            </div>
                                
                            
                        </Col>     
                            
                    </Row>
                    
                </Container>
            </div>
        );
    }
}




const mapStateToProps = state => ({
    loading:state.status.modalLoading || '',   
  });


  
  

export default connect(mapStateToProps,{ fetchocultaModal, fetchCambiaStadoModalFalse })(Modalacciones);


