import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Container, Row, Col } from "reactstrap";
import { Collapse, CardBody, Card, CardHeader } from 'reactstrap';

import { connect } from 'react-redux';
import { fetchTipoTrabajo, fetchTipoAutorizacion, fetchFasesTrabajos } from '../../actions/trabajos';
import  TrabajosTramitables  from './TrabajosTramitables';

import "./styles.css";
class SelectorTipoTrabajo extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.toggle3 = this.toggle3.bind(this);
    this.toggle4 = this.toggle4.bind(this);
    this.toggle5 = this.toggle5.bind(this);
    this.activoObra = this.activoObra.bind(this);
    this.activoTramite = this.activoTramite.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.dropdownToggle2 = this.dropdownToggle2.bind(this);
    this.state = { collapse: false, dd1: false, dd2: false, 
                   descripcion:'', advertencia:'', seleccionado:'',
                  trabajoSelected:'Tipo de trabajo', tramiteSelected:'Tipo de trámite',
                  idTrabajoSelected:1, idTramiteSelected:1,
                estiloActivo3:""};
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
    this.setState({ collapse: !this.state.collapse , collapse4: false ,
       collapse5: false, estiloActivo1:"activo", estiloActivo4:"",estiloActivo5:"",});
  }
  toggle2(e) {
    this.setState({ collapse2: !this.state.collapse2 ,
      estiloActivo2: this.state.estiloActivo2 == "activo" ? "" : "activo"});
  }
  toggle3(e) {
    this.setState({ collapse3: !this.state.collapse3 ,
      estiloActivo3: this.state.estiloActivo3 == "activo" ? "" : "activo"});
  }
  toggle4(e) {
    this.setState({ collapse4: !this.state.collapse4,
       estiloActivo1:"",estiloActivo4:"activo",estiloActivo5:"",
        collapse: false , collapse5: false});
  }
  toggle5(e) {
    this.setState({ collapse5: !this.state.collapse5 ,
       estiloActivo1:"", estiloActivo4:"",estiloActivo5:"activo",
        collapse: false, collapse4: false});
  }
  activoObra(e){
    var gTematico = this.props.trabajos.tiposTrabajos.GruposTematicos;
    for(var i=0; i < gTematico.length; i++){
      if(gTematico[i].Id_Tipo_Grupo_Tematico == e.currentTarget.dataset.id){
        this.setState({ descripcion: gTematico[i].Observaciones});
        this.setState({ advertencia: gTematico[i].Advertencia });
        this.setState({trabajoSelected: gTematico[i].Nombre});
        this.setState({idTrabajoSelected: gTematico[i].Id_Tipo_Grupo_Tematico});
        
      }
    }
  }
  activoTramite(e){
    var gTramite = this.props.tiposAutorizacion;
    for(var i=0; i < gTramite.length; i++){
      if(gTramite[i].Id_Tipo_Autorizacion_Municipal == e.currentTarget.dataset.id){
        
        this.setState({tramiteSelected: gTramite[i].Nombre});
        this.setState({idTramiteSelected: gTramite[i].Id_Tipo_Autorizacion_Municipal});
        this.props.fetchFasesTrabajos(this.state.idTrabajoSelected,this.state.idTramiteSelected);
      }
    }
    
  }

  render() {
    const {cards, collapse} = this.state;
    return (
      <div className="container">
          <h3 className="page-header"></h3>
              <Card style={{ marginBottom: '1rem' }}>
                <CardHeader className={this.state.estiloActivo1} onClick={this.toggle}>OBRAS</CardHeader>
                <Collapse className="fondoSeleccion" isOpen={this.state.collapse}>
                <Container>
                <Row>
                  <Col sm="4">
                  <label>Tipo de obra </label>
                  <Dropdown className="botonTrabajos" isOpen={this.state.dd1} toggle={this.dropdownToggle}>
                    <DropdownToggle caret>
                      {this.state.trabajoSelected}
                    </DropdownToggle>
                    <DropdownMenu>
                      
                    {this.props.trabajos.tiposTrabajos.GruposTematicos.map(grupo => 
                      <DropdownItem onClick={this.activoObra} data-id={grupo.Id_Tipo_Grupo_Tematico} key={grupo.Nombre+'-'+grupo.Id_Tipo_Grupo_Tematico}>{grupo.Nombre}</DropdownItem>
                    )}
                    
                    </DropdownMenu>
                  </Dropdown>
                  </Col>
                  <Col sm="4">
                  <label>Tipo de trámite </label>
                  <Dropdown className="botonTrabajos" isOpen={this.state.dd2} toggle={this.dropdownToggle2}>
                    <DropdownToggle caret>
                      {this.state.tramiteSelected}
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.props.tiposAutorizacion.map(tramite => 
                        <DropdownItem onClick={this.activoTramite} data-id={tramite.Id_Tipo_Autorizacion_Municipal} key={tramite.Nombre+'-'+tramite.Id_Tipo_Autorizacion_Municipal}>{tramite.Nombre}</DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                  </Col>
                </Row>
                </Container>
                <Card className="bootstrapCard">
                  <CardHeader  className={this.state.estiloActivo2} onClick={this.toggle2}>VER DESCRIPCIÓN</CardHeader>
                  <Collapse isOpen={this.state.collapse2}>
                    <CardBody>
                    <div dangerouslySetInnerHTML={{__html: this.state.descripcion}} />
                    </CardBody>
                  </Collapse>
                </Card>
                <Card className="bootstrapCard">
                  <CardHeader className={this.state.estiloActivo3} onClick={this.toggle3}>VER TRABAJOS QUE ES POSIBLE TRAMITAR
                  CONFORME AL TIPO DE EXPEDIENTE Y TRAMITACIÓN ELEGIDOS</CardHeader>
                  <Collapse isOpen={this.state.collapse3}>
                    <CardBody>
                      <Row>
                      <Col sm="6" >
                      <div className="trabajos-tramitar">
                        <p className="fase"><b>Proyecto</b></p>
                        {this.props.fasesTrabajos.map(trabajo =>{
                          if(trabajo.Fase == "Proyecto"){
                            return <p>{trabajo.Trabajo_Titulo}</p>
                          }
                        })}
                      </div>
                      <div className="trabajos-tramitar">
                        <p className="fase"><b>Dirección de ejecución</b></p>
                        {this.props.fasesTrabajos.map(trabajo =>{
                          if(trabajo.Fase == "Dirección de ejec."){
                            return <p>{trabajo.Trabajo_Titulo}</p>
                          }
                        })}
                      </div>
                      <div className="trabajos-tramitar">
                        <p className="fase"><b>Seguridad y salud</b></p>
                        {this.props.fasesTrabajos.map(trabajo =>{
                          if(trabajo.Fase == "Seguridad y salud"){
                            return <p>{trabajo.Trabajo_Titulo}</p>
                          }
                        })}
                      </div>
                      </Col>
                      <Col sm="6">
                      <div className="trabajos-tramitar">
                        <p className="fase"><b>Dirección de obra</b></p>
                        {this.props.fasesTrabajos.map(trabajo =>{
                          if(trabajo.Fase == "Dirección de obra"){
                            return <p>{trabajo.Trabajo_Titulo}</p>
                          }
                        })}
                      </div>
                      </Col>
                      </Row>
                    </CardBody>
                  </Collapse>
                </Card>
                </Collapse>
              </Card>
              <Card style={{ marginBottom: '1rem' }}>
                  <CardHeader className={this.state.estiloActivo4} onClick={this.toggle4}>PLANEAMIENTO</CardHeader>
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
                  <CardHeader className={this.state.estiloActivo5} onClick={this.toggle5}>OTROS TRABAJOS</CardHeader>
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

SelectorTipoTrabajo.defaultProps = {

  loading: false,
};
const mapStateToProps = state => ({
  trabajos: state.trabajos,
  tiposAutorizacion: state.trabajos.tiposAutorizacion.Tipos_autorizacion_municipal,
  fasesTrabajos: state.trabajos.fasesTrabajos.FasesTrabajos,
  loading:state.expedientes.loading
 
});

export default connect(mapStateToProps,{fetchTipoTrabajo,fetchTipoAutorizacion, fetchFasesTrabajos})(SelectorTipoTrabajo);