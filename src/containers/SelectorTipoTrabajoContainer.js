import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectorTipoTrabajo from '../components/SelectorTipoTrabajo/SelectorTipoTrabajo';

import { fetchTipoTrabajo, fetchTipoAutorizacion} from '../actions/trabajos';

class SelectorTipoTrabajoContainer extends Component {
  componentDidMount(){
    let idtrabajo = '1';
    this.props.fetchTipoTrabajo(idtrabajo);
    this.props.fetchTipoTrabajo(2);
    this.props.fetchTipoTrabajo(3);
    this.props.fetchTipoAutorizacion();
  }
  render() {
    return (
      <SelectorTipoTrabajo />
    );
  }
}
const mapStateToProps = state => ({
});
const mapDispatchToProps = {
  fetchTipoTrabajo,
  fetchTipoAutorizacion
};
export default  connect(mapStateToProps,mapDispatchToProps)(SelectorTipoTrabajoContainer);
