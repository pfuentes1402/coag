import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import { connect } from 'react-redux';
import './styles.css';
import TreeDocuments from '../TreeDocuments/TreeDocuments'




class ConteArboles extends Component {
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
    console.log('cdcdcdcdcdcdcdcdcdcdcdcdcd');
      console.log(this.props.data);
   
    return (
      <div>
        <div color="primary" className='bloque' onClick={this.toggle} >{this.props.expedient}</div>
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

export default connect(mapStateToProps,mapDispatchToProps)(ConteArboles);

