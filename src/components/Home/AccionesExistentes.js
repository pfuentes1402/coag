import React, {Component} from 'react';
import {Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchMuestraModal, fetchCambiaStatoModalAcciones } from './../../actions/interfaz/index'
import { fetchSuscepAcciones } from './../../actions/usuarios/index'

import './styles.css';





class AccionesExistentes extends Component { 

    render() {
        const click = (accion)=>{
          
            this.props.fetchSuscepAcciones(accion.Id);      
            this.props.fetchMuestraModal(accion.Id);
            this.props.fetchCambiaStatoModalAcciones();
                
        }              
           
          
           
        
       
        const RenderAccion = acciones =>(
        
            acciones.map((accion,i) =>(
               
                <div className="acciones" key={i} onClick={()=>click(accion)}>
                    <div key={i}>{accion.nombre.toUpperCase()}</div>
                </div>  
            ))
        );
     var acciones =[
            {Id:1,nombre:'Modificar datos expediente'},
            {Id:2,nombre:'Tramitar nuevo trabajo'},
            {Id:3,nombre:'Solicitar Loa(libro de órdenes y asistencias)'},
            {Id:4,nombre:'Solicitar Li(libro de incidencias)'},
            {Id:5,nombre:'convertir a digital expediente papel'},
            {Id:6,nombre:'cesar/cerrar expediente'}
     ]
        return (
            <div>
            <Container className="full">
                <Row className="principal">                   
                                                                 
                 
                    <Col xs="12" sm="12">                        
                        <div className='divderecha'>
                        <p>Acciones directas en expedientes existentes</p> 
                        </div>
                        <div>
                        {RenderAccion(acciones)}
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


  
  

export default connect(mapStateToProps,{ fetchMuestraModal, fetchSuscepAcciones, fetchCambiaStatoModalAcciones })(AccionesExistentes);


