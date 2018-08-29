import React, {Component} from 'react';
import {Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchMuestraModal, fetchCambiaStatoModalAcciones } from './../../actions/interfaz/index'
import { fetchSuscepAcciones } from './../../actions/usuarios/index'
import { withLocalize, Translate } from 'react-localize-redux';
import AccionesTranslations from './../../traducciones/Actions.json'


import './styles.css';





class AccionesExistentes extends Component { 
    constructor(props) {
        super(props);
       this.props.addTranslation(AccionesTranslations);
      }

    render() {
        const click = (accion)=>{
          
            this.props.fetchSuscepAcciones(accion.Id);      
            this.props.fetchMuestraModal(accion.Id);
            this.props.fetchCambiaStatoModalAcciones();
                
        }          

        const RenderAccion = acciones =>(
        <Translate>
            {({translate})=>
                acciones.map((accion,i) =>(
               
                <div className="acciones" key={i} onClick={()=>click(accion)}>
                    <p>
                        {translate(`Actions.listactions.action${i}`).toUpperCase()}
                    </p>
                   
                </div>  
            ))}
            </Translate>
        );
     var acciones =[
        {Id:0,nombre:'Modificar datos expediente'},
        {Id:1,nombre:'Tramitar nuevo trabajo'},
        {Id:2,nombre:'Solicitar Loa(libro de órdenes y asistencias)'},
        {Id:3,nombre:'Solicitar Li(libro de incidencias)'},
        {Id:4,nombre:'convertir a digital expediente papel'},
        {Id:5,nombre:'cesar/cerrar expediente'}
     ]
        return (
            <div>
            <Container className="full">
                <Row className="principal">                   
                                                                 
                 
                    <Col xs="12" sm="12">                        
                        <div className='divderecha'>
                        <p><Translate id="Actions.title"></Translate></p> 
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


  
  

export default connect(mapStateToProps,{ fetchMuestraModal, fetchSuscepAcciones, fetchCambiaStatoModalAcciones })(withLocalize(AccionesExistentes));


