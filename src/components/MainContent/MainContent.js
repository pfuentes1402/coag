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
          

           //this.props.fetchEstructuraDocumental(id_e, id_t);         
           
        }
       
        handleSelectedExpediente = trabajo => {
           
            this.props.setSelectedExpediente(trabajo);
            this.props.setSelectedExpedienteTo(trabajo.Id_Expediente,trabajo.Id_Trabajo);
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
    
    selectedIdTrabajo:state.expedientes.selectedData?state.expedientes.selectedData.Id_Trabajo:"",
    selectedData:state.expedientes.expedieteotrabajo,
    
   
  });


  
  

export default connect(mapStateToProps,{fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes, test,
     fetchTrabajoDatosGeneral,fetchEstructuraDocumentalTrabajo, setSelectedExpediente, setSelectedExpedienteTo})(MainContent);


  

    
    
  