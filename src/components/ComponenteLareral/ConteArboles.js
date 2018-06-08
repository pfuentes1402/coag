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
//   <div className="bloqueInterno" >
//   {dato.Titulo}
// </div> 

  render() {
    const handleClickLateral = trabajo =>{
      // console.log('Trabajo tras click');
      // console.log(trabajo);
      //   onSelectedLevel(trabajo);
      //   fetchExpedienteSelected(trabajo);  
      //   fetchEstructuraDocumentalTrabajo(trabajo.Id_Expediente,trabajo.Id_Trabajo);
    };
    


       const strToComponentTrabajo = datos =>(        
        datos.map(dato =>(
          <div className="bloqueInterno">
          <Expandible key={dato.Fecha_Entrada}
          expedient={dato.Titulo}
          data={this.props.dataArbol}
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
            {/* <TreeDocuments data={this.props.dataArbol}/> */}
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

export default connect(mapStateToProps,mapDispatchToProps)(ConteArboles);

