import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import { connect } from 'react-redux';
import './styles.css';
import TreeDocuments from '../TreeDocuments/TreeDocuments'
import ContenedorExpediente from '../ComponenteLareral/ContenedorExpediente'



class Expandible extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
    
    
   
  }



  render() {
    const handleClickLateral = trabajo =>{
        console.log(trabajo);
    };

    const strToComponentTrabajo = (trabajos) =>(       
      
      trabajos.map(dato =>(
      
        <div className="bloqueInterno">
       {dato.Titulo}       
       <ContenedorExpediente
       OnhandleClickLateral={()=>handleClickLateral(dato)}
       />
        
      </div>
   
      ))
  );


 
    return (
      <div>
        <div  color="primary" className='bloqueInterno' onClick={this.toggle} >{this.props.expedient}</div>
        <Collapse isOpen={this.state.collapse}>
          <div >
            <div>{this.props.expedient}
            {strToComponentTrabajo(this.props.trabajos)}  
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

Expandible.defaultProps = {
 
  trabajos: [],
 
};

const mapStateToProps = state => ({
     
  dataArbol: state.expedientes.arbolEstructuraTrabajoRefactor?state.expedientes.arbolEstructuraTrabajoRefactor[0]:'',
  trabajos: state.expedientes.expedienteData?state.expedientes.expedienteData.Trabajos:'',
  });
  const mapDispatchToProps = state => ({
        
   
  });

export default connect(mapStateToProps,mapDispatchToProps)(Expandible);

