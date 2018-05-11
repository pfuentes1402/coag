import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import './styles.css';
import TreeDocuments from "../TreeDocuments/TreeDocuments";
import {fetchExpedientes, fetchExpediente, fetchExpedienteDatosGeneral} from '../../actions/expedientes';
import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import {Divider} from 'material-ui'
import LastWorks from '../lastWorks/LastWorks';
import ListWorks from '../ListWorks/ListWorks';
import OverViewComponent from '../OverViewComponent/OverViewComponent';
import {getExpedienteGeneral} from '../../api/index';
import ExpedientType from '../MainContent/ExpedientType/ExpedientType';
import ExpedientContainer from './ExpedientContainer';

class MainContent extends Component {
  

    componentDidMount(){
            let id_expediente='688685';
            this.props.fetchExpedientes(id_expediente);
            this.props.fetchExpediente(id_expediente);
            console.log("Gooooo");
            this.props.fetchExpedienteDatosGeneral(id_expediente)
           
           
    }
   
    
    render() {


        return (
            <div>
                <Container className="full">
                    <Row className="principal">
                        <Col xs="6" sm="2">                            
                             <TreeDocuments data={this.props.arbolCompleto}/>                            
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
                                <ExpedientContainer titulo='Promotores'/>
                                <ExpedientContainer titulo='Arquitectos'/>
                            </div>   
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

MainContent.propTypes = {
    arbolCompleto: PropTypes.arrayOf(PropTypes.shape()),
    loading: PropTypes.bool
};

MainContent.defaultProps = {
    arbolCompleto: [],
    trabajos: [],
    loading: false,
  };
const mapStateToProps = state => ({
    arbolCompleto: state.expedientes.arbolCompleto,
    trabajos: state.expedientes.trabajos,
    loading:state.expedientes.loading
   
  });

export default connect(mapStateToProps,{fetchExpedientes, fetchExpediente, fetchExpedienteDatosGeneral})(MainContent);
