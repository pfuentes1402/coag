import React, {Component} from 'react';

import './styles.css';

import { fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes,
     fetchTrabajoDatosGeneral, fetchEstructuraDocumentalTrabajo, setSelectedExpediente} from '../actions/expedientes';
import {test} from '../api/index'
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';

import ListWorks from '../components/ListWorks/ListWorks';
import OverViewComponent from '../components/OverViewComponent/OverViewComponent';

import ExpedientType from '../components/MainContent/ExpedientType/ExpedientType';
import ExpedientContainer from '../components/MainContent/ExpedientContainer';
import FichaTrabajo from '../components/Trabajos/FichaTrabajo'


const   id_expediente='688685';

class ContenedorExpedientes extends Component {

    componentDidMount(){
       
        let idtrabajo = this.props.selectedData.id_Trabajo;
      console.log(idtrabajo);
        
      
        this.props.fetchExpedienteDatosGeneral(id_expediente);           
       // this.props.fetchTrabajoDatosGeneral(id_expediente,2)                     
        this.props.getAgentes('111');
        test('111');
        //this.props.setSelectedExpediente(); 
          
    
    }
    componentWillReceiveProps(){
       
    
    var idtrabajo = this.props.selectedIdTrabajo;
    
       
    }
   
    render() {
        return (
            <div>
            <Container className="full">
                <Row className="principal">
                    
                                                                 
                    <Col xs="6" sm="8">
                        <div className='divderecha'>                           
                            <Card>                             
                                <CardHeader><p>Ficha del trabajo</p></CardHeader>    
                                    <CardText> <FichaTrabajo/> </CardText>
                            </Card> 
                        </div>   
                        <div className='divderecha'>             
                                {/*<LastWorks data={this.props.trabajos}/>*/} 
                                
                        </div>
                    </Col>
                    <Col xs="6" sm="5">
                        <div className='divderecha'>
                        
                        </div>
                    </Col>     
                          
                </Row>
                <Row>
                <Col sm={{ size: '6', offset: 2 }}>
                        <div className='divderecha'>   
                          
                        </div>   
                    </Col>
                </Row>
            </Container>
        </div>
        );
    }
}



ContenedorExpedientes.defaultProps = {
    arbolEstructuraTrabajoRefactor: [],
    datosAgentes:[],
    trabajos: [],
    loading: false,
  };
const mapStateToProps = state => ({
    arbolEstructuraDocumentalTrabajo: state.expedientes.arbolEstructuraDocumentalTrabajo,
    trabajos: state.expedientes.expedienteData? state.expedientes.expedienteData.Trabajos:[],
    loading:state.expedientes.loading,
    datosAgentes:state.expedientes.datosAgentes ? state.expedientes.datosAgentes:"",
    selectedIdexpediente:state.expedientes.selectedData?state.expedientes.selectedData.Id_Expediente:"",
    selectedData:state.expedientes.selectedData,
    selectedIdTrabajo:state.expedientes.selectedData?state.expedientes.selectedData.Id_Trabajo:"",
    
   
  });


  
  

export default connect(mapStateToProps,{fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes, test,
     fetchTrabajoDatosGeneral,fetchEstructuraDocumentalTrabajo, setSelectedExpediente})(ContenedorExpedientes);


