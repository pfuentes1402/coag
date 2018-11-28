import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SubHeader.css';
import { Container, Row, Col } from 'reactstrap';

class SubHeader extends Component {
    render() {
        
        return (
            <div>
                {this.props.title ?
                    <div className="subheader">
                        <Container className="full">
                            <Row>
                                <Col sm="3" className="titulo">{this.props.title}</Col>
                                <Col sm="9">

                                </Col>
                            </Row>
                        </Container>
                    </div>
                    : ""
                }
            </div>
        );
    }
}

SubHeader.propTypes = {
    title : PropTypes.string.isRequired
};

export default SubHeader;