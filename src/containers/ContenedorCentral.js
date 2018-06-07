import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes,
    fetchTrabajoDatosGeneral, fetchEstructuraDocumentalTrabajo, setSelectedExpediente} from './../actions/expedientes';

import OverViewComponent from './../components/OverViewComponent/OverViewComponent';
import './styles.css';   

import {Divider} from 'material-ui'
import ContenedorExpedientes from './ContenedorExpedientes';
import ContenedorTrabajos from './ContenedorTrabajos';

/*class ContenedorCentral extends Component {
    render() {
        return (
            <div>
            <Row>
                <Col xs="6" sm="5">
                                <div className='divderecha'>                           
                                    <Card>                             
                                        <CardHeader>Ficha expediente</CardHeader>    
                                            <CardText> <OverViewComponent/> </CardText>
                                    </Card> 
                                </div>   
                                <div className='divderecha'>             
                                        {/*<LastWorks data={this.props.trabajos}/>} 
                                        
                                </div>
                </Col>                        
            </Row>  
               <Row className="principal">
               <Col xs="6" sm="5">
                            <div className='divderecha'>
                                <ListWorks/>
                            </div>
                        </Col>     
               <Col xs="6" sm="10">
                   <ContenedorCentral/>
               </Col>                   

           </Row>  
         </div>                     
            
          
        );
    }
}*/
const RenderContenedorcentral =() =>{
    return (<ContenedorTrabajos/>)
}
const RenderContenedorcentrales =() =>{
    return (<ContenedorExpedientes/>)
}

const Contenedorcentral= ({contenidoExp}) =>(

    <div>
    {contenidoExp === 'Trabajo' ? RenderContenedorcentral():RenderContenedorcentrales()}
    
    </div>
)





export default Contenedorcentral;