import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Container, Row, Col } from 'reactstrap';
import ContenedorCentral from './../../containers/ContenedorCentral';
import AccionesExistentes from './../Home/AccionesExistentes';
import './styles.css';


class MainContent extends Component {
    
    render() {
           return (
           
            <div>
                <Container className="full">
                    <Row className="principal">
                        <Col xs="12" md={4} lg={3} className="p-0" style={{backgroundColor: "#FFFFFF"}}>
                            <AccionesExistentes />
                        </Col>
                        <Col xs="12" md={8} lg={9}>
                            <ContenedorCentral />
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

export default MainContent;


  

    
    
  