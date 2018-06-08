import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import { connect } from 'react-redux';
import './styles.css';
import TreeDocuments from '../TreeDocuments/TreeDocuments'



class Expandible extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
    this.props.OnhandleClickLateral();
    
   
  }

  render() {
    console.log('>>>>>>>>>>>>>>>>>>>>>');
    console.log(this.props.dataArbol);
    return (
      <div>
        <div  color="primary" className='bloqueInterno' onClick={this.toggle} >{this.props.expedient}</div>
        <Collapse isOpen={this.state.collapse}>
          <div >
            <div>{this.props.expedient}
            <TreeDocuments data={this.props.data}/>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = state => ({
     
  dataArbol: state.expedientes.arbolEstructuraTrabajoRefactor?state.expedientes.arbolEstructuraTrabajoRefactor[0]:'',
  });
  const mapDispatchToProps = state => ({
        
   
  });

export default connect(mapStateToProps,mapDispatchToProps)(Expandible);

