import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import './styles.css';
import TreeDocuments from "../TreeDocuments/TreeDocuments";
import {fetchExpedientes, fetchExpediente} from '../../actions/expedientes'
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import {Divider} from 'material-ui'

class MainContent extends Component {
  

    componentDidMount(){
            let id_expediente='688685';
            this.props.fetchExpedientes(id_expediente);
            this.props.fetchExpediente(id_expediente);
    }
    
    render() {

        let  data = this.props.trabajos;     
        return (
            <div>
                <Container className="full">
                    <Row className="principal">
                    <Col xs="6" sm="3">
                        <TreeDocuments data={this.props.tree}/>
                    </Col>
                    <Col xs="6" sm="9">
                       <div className='divizquierda'></div>
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

export default connect(mapStateToProps,{fetchExpedientes, fetchExpediente})(MainContent);
