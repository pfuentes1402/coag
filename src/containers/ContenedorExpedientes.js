import React, {Component} from 'react';
import './styles.css';
import { fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes,
     fetchTrabajoDatosGeneral, fetchEstructuraDocumentalTrabajo, setSelectedExpediente} from '../actions/expedientes';
import {test} from '../api/index'
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import ListWorks from '../components/ListWorks/ListWorks';
import FichaExpediente from '../components/OverViewComponent/FichaExpediente';
import ExpedientType from '../components/MainContent/ExpedientType/ExpedientType';
import ExpedientContainer from '../components/MainContent/ExpedientContainer';

class ContenedorExpedientes extends Component {
    componentDidMount(){
    
    }
    componentWillReceiveProps(){
       let id_e = this.props.selectedIdexpediente;
       let id_t = this.props.selectedIdTrabajo;
    }
   
    render() {
        return (
            <div>
            <Container className="full">
                <Row className="principal">
                    <Col xs="6" sm="6">
                        <div className='divderecha'>                           
                            <Card>                             
                                <CardHeader>Ficha expediente</CardHeader>    
                                    <CardText tag="div"> <FichaExpediente/> </CardText>
                            </Card> 
                        </div>   
                        <div className='divderecha'>             
                                {/*<LastWorks data={this.props.trabajos}/>*/} 
                                
                        </div>
                    </Col>
                    <Col xs="6" sm="6">
                        <div className='divderecha'>
                            <ListWorks/>
                        </div>
                        
                    </Col>     
                          
                </Row>
                <Row>
                <Col sm={{ size: '6' }}>
                        <div className='divderecha'>   
                            <Card>
                                <CardHeader>Tipo de Expediente</CardHeader>    
                                    <CardText tag="div"> <ExpedientType/> </CardText>
                            </Card> 
                            <div className="expedientes">
                                <ExpedientContainer titulo='Promotores' datosAgentes={this.props.Promotores}/>
                            </div>
                            <div className="expedientes">
                                <ExpedientContainer titulo='Arquitectos' datosAgentes={this.props.Arquitectos}/>
                            </div>
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
    Arquitectos:state.expedientes.expedienteData?state.expedientes.expedienteData.Colegiados:"",
    Promotores:state.expedientes.expedienteData?state.expedientes.expedienteData.Promotores:"",
    
   
  });


  
  

export default connect(mapStateToProps,{fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes, test,
     fetchTrabajoDatosGeneral,fetchEstructuraDocumentalTrabajo, setSelectedExpediente})(ContenedorExpedientes);


