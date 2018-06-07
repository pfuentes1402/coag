import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './styles.css';
import TreeDocuments from "../TreeDocuments/TreeDocuments";
import { fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes,
     fetchTrabajoDatosGeneral, fetchEstructuraDocumentalTrabajo, setSelectedExpediente, setSelectedExpedienteTo} from '../../actions/expedientes';
import {test} from '../../api/index'
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';

import ListWorks from '../ListWorks/ListWorks';
import OverViewComponent from '../OverViewComponent/OverViewComponent';

import ExpedientType from '../MainContent/ExpedientType/ExpedientType';
import ExpedientContainer from './ExpedientContainer';
import Componentelateral from './../ComponenteLareral/Componentelateral.js';
import ContenedorCentral from './../../containers/ContenedorCentral'
import { fetchDatosUsuario } from '../../actions/usuarios';
const   id_expediente='688685';

class MainContent extends Component {
  

    componentWillMount(){
           //Esto es dummy, los datos del usuario estan seteados en el api
            let idtrabajo = '2';      
            this.props.fetchDatosUsuario(idtrabajo);
                      
    }
   
       
        handleSelectedExpediente = d => {
           
             if(d.Id_Expediente!=null){

              
                this.props.setSelectedExpedienteTo(d.Id_Expediente,d.Id_Trabajo)

             }else{
               
                 this.props.setSelectedExpediente(d);
               
             }   
             
               
               
            
            
        }
   
    
    render() {
     
        
        return (
           
            <div>
                <Container className="full">
                    <Row className="principal">
                        <Col xs="6" sm="2">
                        <Componentelateral trabajos={this.props.trabajos}
                        onSelectedLevel={this.handleSelectedExpediente}/>                            
                                               
                    
                        </Col>
                        <Col xs="6" sm="10">
                            <ContenedorCentral contenidoExp ={this.props.selectedData} />
                        </Col>                   

                    </Row>                    
                </Container>
            </div>
        );
    }
}

MainContent.propTypes = {    
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
    selectedIdTrabajo:state.expedientes.selectedData?state.expedientes.selectedData.Id_Trabajo:"",
    selectedData:state.expedientes.expedieteotrabajo,
    
   
  });


  
  

export default connect(mapStateToProps,{fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes, test,
     fetchTrabajoDatosGeneral,fetchEstructuraDocumentalTrabajo, setSelectedExpediente, setSelectedExpedienteTo,fetchDatosUsuario})(MainContent);


  

    
    
  