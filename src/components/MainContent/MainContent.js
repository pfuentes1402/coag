import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes,
     fetchTrabajoDatosGeneral, fetchEstructuraDocumentalTrabajo, setSelectedExpediente, setSelectedExpedienteTo} from '../../actions/expedientes';
import {test} from '../../api/index'
import {Container, Row, Col } from 'reactstrap';
import Componentelateral from './../ComponenteLareral/Componentelateral.js';
import ContenedorCentral from './../../containers/ContenedorCentral';
import Expandible from '../ComponenteLareral/Expandible';
import { connect } from 'react-redux';
import AccionesExistentes from './../Home/AccionesExistentes';
import './styles.css';


class MainContent extends Component {
  
       handleSelectedExpediente = d => {
          
           
        if (d.Id_Expediente != null) {
            this.props.setSelectedExpedienteTo(d.Id_Expediente, d.Id_Trabajo);
           

        } else {
            this.props.setSelectedExpediente(d);
            this.props.fetchExpedienteDatosGeneral(d);

        }

    }
   
    
    render() {
        const RenderComponenteExp =() =>{
            return (<Componentelateral onSelectedLevel={this.handleSelectedExpediente}/>)
        }
       
        const RenderContenedorTrabajos =() =>{
            
            return (<Expandible />)
        }
        const RenderContenedorAcciones =() =>{
            
            return (<AccionesExistentes />)
        }
        

     
       
        return (
           
            <div>
                <Container className="full">
                    <Row className="principal">
                        <Col xs="6" sm="2">                        
                        {this.props.expTrabajo === 'expediente' ?RenderContenedorTrabajos(): RenderComponenteExp()}
                        {/* {this.props.expTrabajo === 'inicial' ?RenderContenedorAcciones(): RenderComponenteExp()} */}
                        {/* {RenderContenedorAcciones()} */}
                    
                        </Col>
                        <Col xs="6" sm="10">
                            <ContenedorCentral contenidoExp ={this.props.expTrabajoParaCentral} />
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
    //trabajos: state.expedientes.expedienteData? state.expedientes.expedienteData.Trabajos:[],
    loading:state.expedientes.loading,
    datosAgentes:state.expedientes.datosAgentes ? state.expedientes.datosAgentes:"",
    selectedIdexpediente:state.expedientes.selectedData?state.expedientes.selectedData.Id_Expediente:"",    
    selectedIdTrabajo:state.expedientes.selectedData?state.expedientes.selectedData.Id_Trabajo:"",
    selectedData:state.expedientes.expedieteotrabajo,
    expTrabajo:state.seleccionado.selectedExpediente || '',
    expTrabajoParaCentral:state.seleccionado.expTrabajoParaCentral || '',
    
   
    
   
  });


  
  

export default connect(mapStateToProps,{fetchEstructuraDocumental, fetchExpedienteDatosGeneral, getAgentes, test,
     fetchTrabajoDatosGeneral,fetchEstructuraDocumentalTrabajo, setSelectedExpediente, setSelectedExpedienteTo})(MainContent);


  

    
    
  