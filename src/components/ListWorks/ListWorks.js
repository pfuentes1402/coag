import React, { Component } from 'react';
import TablaTrabajos from './TablaTrabajos';

import {Container, Row, Col, Card,  CardHeader, CardText } from 'reactstrap';

class ListWorks extends Component {
    render() {
        return (
            <Container className="Contenedor">            
                <Row>
                    <Col> 
                        <Card className="card-Trabajos">
                            <CardHeader>Trabajos</CardHeader>
                                                                
                                <CardText  className="card-body-Trabajos"><TablaTrabajos/></CardText>
                        </Card>
                    </Col>
             </Row>
            </Container>           
        );
    }
}

export default ListWorks;