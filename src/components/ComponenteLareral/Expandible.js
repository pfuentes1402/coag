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
        <div color="primary" className='bloque' onClick={this.toggle} >{this.props.expediente}</div>
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
            <TreeDocuments data={this.props.data}/>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = state => ({
     
   
  });
  const mapDispatchToProps = state => ({
        
   
  });

export default connect(mapStateToProps,mapDispatchToProps)(Expandible);

