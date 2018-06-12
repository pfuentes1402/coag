import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import { connect } from 'react-redux';
import './styles.css';
import TreeDocuments from '../TreeDocuments/TreeDocuments';
import ContenedorExpediente from '../ComponenteLareral/ContenedorExpediente';
import { setSelectedExpedienteTo } from '../../actions/expedientes';
import ContenedorTrabajos from '../../containers/ContenedorTrabajos';
import PropTypes from 'prop-types';



class ContenedorTrabajo extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle(e) {
     
    this.setState({ collapse: !this.state.collapse });  
   
  }



  render() { 
    
     return (
  
      <div>
        <div  color="primary" onClick={this.toggle} >{this.props.titulo}</div>
        <Collapse isOpen={this.state.collapse}>
          <div >
            <div>           
            <TreeDocuments data={this.props.dataArbol}/>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

ContenedorTrabajo.defaultProps = {
 
  trabajos: [],
    dataArbol: PropTypes.arrayOf(PropTypes.shape()),
   
};
 

const mapStateToProps = state => ({     
  //dataArbol: state.expedientes.arbolEstructuraDocumentalTrabajo&&state.expedientes.arbolEstructuraDocumentalTrabajo[0],
  dataArbol: state.expedientes.arbolEstructuraDocumentalTrabajo,
 
  });
 

export default connect(mapStateToProps,{ setSelectedExpedienteTo })(ContenedorTrabajo);

