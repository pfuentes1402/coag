import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from "reactstrap";
import { Collapse, CardBody, Card, CardHeader } from 'reactstrap';


class SelectorTipoExpediente extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.toggle3 = this.toggle3.bind(this);
    this.toggle4 = this.toggle4.bind(this);
    this.toggle5 = this.toggle5.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.dropdownToggle2 = this.dropdownToggle2.bind(this);
    this.state = { collapse: false, dd1: false, dd2: false};
  }
  dropdownToggle() {
    this.setState({
      dd1: !this.state.dd1
    });
  }
  dropdownToggle2() {
    this.setState({
      dd2: !this.state.dd2
    });
  }
  toggle(e) {
    this.setState({ collapse: !this.state.collapse , collapse4: false , collapse5: false});
  }
  toggle2(e) {
    this.setState({ collapse2: !this.state.collapse2 });
  }
  toggle3(e) {
    this.setState({ collapse3: !this.state.collapse3 });
  }
  toggle4(e) {
    this.setState({ collapse4: !this.state.collapse4, collapse: false , collapse5: false});
  }
  toggle5(e) {
    this.setState({ collapse5: !this.state.collapse5 , collapse: false, collapse4: false});
  }
  render() {
    const {cards, collapse} = this.state;
    return (
      <div className="container">
          <h3 className="page-header"></h3>
              <Card style={{ marginBottom: '1rem' }}>
                <CardHeader onClick={this.toggle}>OBRAS</CardHeader>
                <Collapse isOpen={this.state.collapse}>
                <Container>
                <Row>
                  <Col sm="4">
                  <label>Tipo de obra </label>
                  <Dropdown isOpen={this.state.dd1} toggle={this.dropdownToggle}>
                    <DropdownToggle caret>
                      Dropdown
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Header</DropdownItem>
                      <DropdownItem disabled>Action</DropdownItem>
                      <DropdownItem>Another Action</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>Another Action</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  </Col>
                  <Col sm="4">
                  <label>Tipo de trámite </label>
                  <Dropdown isOpen={this.state.dd2} toggle={this.dropdownToggle2}>
                    <DropdownToggle caret>
                      Dropdown
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Header</DropdownItem>
                      <DropdownItem disabled>Action</DropdownItem>
                      <DropdownItem>Another Action</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>Another Action</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                  </Col>
                </Row>
                </Container>
                <CardBody>
                  Anim pariatur cliche reprehenderit,
                  enim eiusmod high life accusamus terry richardson ad squid. Nihil
                  anim keffiyeh helvetica, craft beer labore wes anderson cred
                  nesciunt sapiente ea proident.
                </CardBody>
                <Card style={{ margin: '1rem' }}>
                  <CardHeader onClick={this.toggle2}>VER DESCRIPCIÓN</CardHeader>
                  <Collapse isOpen={this.state.collapse2}>
                    <CardBody>
                      Anim pariatur cliche reprehenderit,
                      enim eiusmod high life accusamus terry richardson ad squid. Nihil
                      anim keffiyeh helvetica, craft beer labore wes anderson cred
                      nesciunt sapiente ea proident.
                    </CardBody>
                  </Collapse>
                </Card>
                <Card style={{ margin: '1rem' }}>
                  <CardHeader onClick={this.toggle3}>VER TRABAJOS QUE ES POSIBLE TRAMITAR
                  CONFORME AL TIPO DE EXPEDIENTE Y TRAMITACIÓN ELEGIDOS</CardHeader>
                  <Collapse isOpen={this.state.collapse3}>
                    <CardBody>
                      Anim pariatur cliche reprehenderit,
                      enim eiusmod high life accusamus terry richardson ad squid. Nihil
                      anim keffiyeh helvetica, craft beer labore wes anderson cred
                      nesciunt sapiente ea proident.
                    </CardBody>
                  </Collapse>
                </Card>
                </Collapse>
              </Card>
              <Card style={{ marginBottom: '1rem' }}>
                  <CardHeader onClick={this.toggle4}>PLANEAMIENTO</CardHeader>
                  <Collapse isOpen={this.state.collapse4}>
                    <CardBody>
                      Anim pariatur cliche reprehenderit,
                      enim eiusmod high life accusamus terry richardson ad squid. Nihil
                      anim keffiyeh helvetica, craft beer labore wes anderson cred
                      nesciunt sapiente ea proident.
                    </CardBody>
                  </Collapse>
                </Card>
                <Card style={{ marginBottom: '1rem' }}>
                  <CardHeader onClick={this.toggle5}>OTROS TRABAJOS</CardHeader>
                  <Collapse isOpen={this.state.collapse5}>
                    <CardBody>
                      Anim pariatur cliche reprehenderit,
                      enim eiusmod high life accusamus terry richardson ad squid. Nihil
                      anim keffiyeh helvetica, craft beer labore wes anderson cred
                      nesciunt sapiente ea proident.
                    </CardBody>
                  </Collapse>
                </Card> 
          
        </div>
    );
  }
}

SelectorTipoExpediente.propTypes = {

};

export default SelectorTipoExpediente;