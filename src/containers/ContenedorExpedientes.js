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


//const   id_expediente='688685';

class ContenedorExpedientes extends Component {

    componentDidMount(){
           
        let idtrabajo = '2';
      
        
      
        //this.props.fetchExpedienteDatosGeneral(id_expediente);           
       // this.props.fetchTrabajoDatosGeneral(id_expediente,2)                     
       // this.props.getAgentes('111');
       // test('111');
        //this.props.setSelectedExpediente(); 
          
    
    }
    componentWillReceiveProps(){
       // this.props.trabajos &&
       // this.props.trabajos.map(x =>this.props.fetchTrabajoDatosGeneral(x.Id_Expediente,x.Id_Trabajo));           
       // this.props.trabajos.map(x =>this.props.fetchEstructuraDocumentalTrabajo(x.Id_Expediente,x.Id_Trabajo)); 
       let id_e = this.props.selectedIdexpediente;
       let id_t = this.props.selectedIdTrabajo;
      

       //this.props.fetchEstructuraDocumental(id_e, id_t);         
       
    }
   
  



    render() {
        console.log("Contenedor de Expedientes");
        console.log(this.props.Arquitectos);
        console.log("Contenedor de Expedientes");
        return (
            <div>
            <Container className="full">
                <Row className="principal">
                    
                                                                 
                    <Col xs="6" sm="6">
                        <div className='divderecha'>                           
                            <Card>                             
                                <CardHeader>Ficha expediente</CardHeader>    
                                    <CardText tag="div"> <OverViewComponent/> </CardText>
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
    Promotores:state.expedientes.expedienteData?state.expedientes.expedienteData.Colegiados:"",
    
   
  });


  
  

export default connect(mapStateToProps,{fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes, test,
     fetchTrabajoDatosGeneral,fetchEstructuraDocumentalTrabajo, setSelectedExpediente})(ContenedorExpedientes);


