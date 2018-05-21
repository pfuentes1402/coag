import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './styles.css';
import TreeDocuments from "../TreeDocuments/TreeDocuments";
import { fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes,
     fetchTrabajoDatosGeneral, fetchEstructuraDocumentalTrabajo, setSelectedExpediente} from '../../actions/expedientes';
import {test} from '../../api/index'
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';

import ListWorks from '../ListWorks/ListWorks';
import OverViewComponent from '../OverViewComponent/OverViewComponent';

import ExpedientType from '../MainContent/ExpedientType/ExpedientType';
import ExpedientContainer from './ExpedientContainer';
import Componentelateral from './../ComponenteLareral/Componentelateral.js';
const   id_expediente='688685';

class MainContent extends Component {
  

    componentDidMount(){
           
            let idtrabajo = '2';
          
            
          
            this.props.fetchExpedienteDatosGeneral(id_expediente);           
           // this.props.fetchTrabajoDatosGeneral(id_expediente,2)                     
            this.props.getAgentes('111');
            test('111');
            //this.props.setSelectedExpediente(); 
              
        
        }
        componentWillReceiveProps(){
           // this.props.trabajos &&
           // this.props.trabajos.map(x =>this.props.fetchTrabajoDatosGeneral(x.Id_Expediente,x.Id_Trabajo));           
           // this.props.trabajos.map(x =>this.props.fetchEstructuraDocumentalTrabajo(x.Id_Expediente,x.Id_Trabajo)); 
           let id_e = this.props.selectedIdexpediente;
           let id_t = this.props.selectedIdTrabajo;
           console.log("-------------------------------------");
           console.log(id_e);
           console.log(id_t);

           //this.props.fetchEstructuraDocumental(id_e, id_t);         
           
        }
       
        handleSelectedExpediente = trabajo => {
            this.props.setSelectedExpediente(trabajo);
        }
   
    
    render() {
     
        
        return (
           
            <div>
                <Container className="full">
                    <Row className="principal">
                        <Col xs="6" sm="2">
                        <Componentelateral trabajos={this.props.trabajos}
                        onSelectedLevel={this.handleSelectedExpediente}/>                            
                             {/*<TreeDocuments data={this.props.arbolEstructuraDocumentalTrabajo}/> */ }                         
                        </Col>
                                                                     
                        <Col xs="6" sm="5">
                            <div className='divderecha'>  
                           
                                <Card>
                             
                                    <CardHeader>Ficha expediente</CardHeader>    
                                        <CardText> <OverViewComponent/> </CardText>
                                </Card> 
                            </div>   
                            <div className='divderecha'>             
                                    {/*<LastWorks data={this.props.trabajos}/>*/} 
                                    
                            </div>
                        </Col>
                        <Col xs="6" sm="5">
                            <div className='divderecha'>
                                <ListWorks/>
                            </div>
                        </Col>     
                              
                    </Row>
                    <Row>
                    <Col sm={{ size: '6', offset: 2 }}>
                            <div className='divderecha'>   
                                <Card>
                                    <CardHeader>Tipo de Expediente</CardHeader>    
                                        <CardText> <ExpedientType/> </CardText>
                                </Card> 
                                <ExpedientContainer titulo='Promotores' datosAgentes={this.props.datosAgentes.Arquitectos}/>
                                <ExpedientContainer titulo='Arquitectos' datosAgentes={this.props.datosAgentes.Promotores}/>
                            </div>   
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

MainContent.propTypes = {
    arbolEstructuraDocumentalTrabajo: PropTypes.arrayOf(PropTypes.shape()),
    loading: PropTypes.bool
};

MainContent.defaultProps = {
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
     fetchTrabajoDatosGeneral,fetchEstructuraDocumentalTrabajo, setSelectedExpediente})(MainContent);


  
    