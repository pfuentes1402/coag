import React, { Component } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';
import { connect } from 'react-redux';
import './styles.css';
import TreeDocuments from '../TreeDocuments/TreeDocuments';
import Expandible from '../ComponenteLareral/Expandible';





class ConteArboles extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.props.OnhandleClickLateral();  
    this.setState({ collapse: !this.state.collapse });
     
   
  }


  render() {
    const handleClickLateral = trabajo =>{
     
      //   onSelectedLevel(trabajo);
      //   fetchExpedienteSelected(trabajo);  
      //   fetchEstructuraDocumentalTrabajo(trabajo.Id_Expediente,trabajo.Id_Trabajo);
    };
    


       const strToComponentTrabajo = datos =>(        
        datos.map(dato =>(
          <div className="bloqueInterno">
          <Expandible key={dato.Fecha_Entrada}
          expedient={dato.Titulo}         
          OnhandleClickLateral={()=>handleClickLateral(dato)}/>
        </div>
     
        ))
    );


    return (
      <div>
        <div color="primary" className='bloque' onClick={this.toggle} >{this.props.expedient}</div>
        <Collapse isOpen={this.state.collapse}>
          <div>
            <div className="bloqueInterno">
            {strToComponentTrabajo(this.props.data)}            
            </div>
          </div>
        </Collapse>
       
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trabajos: state.expedientes.expedienteData?state.expedientes.expedienteData.Trabajos:'',
   
  });
  const mapDispatchToProps = state => ({
   
   
  });

export default connect(mapStateToProps,mapDispatchToProps)(ConteArboles);

