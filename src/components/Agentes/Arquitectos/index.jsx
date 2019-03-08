import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Grid } from '@material-ui/core';
import { fetchFuncionesTipologia } from '../../../actions/trabajos/index';
import '../indexstyle.css';
import FormArquitecto from './arquitecto';
import SearchAgents from '../search';
import { getBuscador, getFuncionesTipologia } from '../../../api';

const styles = theme => ({
  marginPanel: {
    margin: '15px 0px'
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 200,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  subtitle: {
    padding: "10px 20px"
  },
  tableBodyHeight: {
    minHeight: 100
  },
  headHeight: {
    height: 40
  },
  fab: {
    margin: theme.spacing.unit,
    marginTop: 25,
    position: 'absolute',
    marginLeft: 40
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
    textAlign: 'left',
    marginTop: 5
  },
  centerText: {
    textAlign: "center"
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  paddingButtons: {
    padding: 15
  },
  button: {
    margin: theme.spacing.unit,
  },
  resultPanel: {
    padding: "20px 30px"
  },
  subtitleData: {
    marginTop: 10,
    fontWeight: "normal"
  },
  usericon: {
    margin: theme.spacing.unit,
    fontSize: 150,
  },
  mt0: {
    marginTop: -10
  },
  iconoption: {
    margin: theme.spacing.unit,
    color: theme.palette.text.primary
  },
  buttonEdit: {
    border: "1px solid",
    padding: 8,
    margin: 4
  },
  selectAgent: {
    backgroundColor: theme.palette.background.main,
  }
});

const CustomTableHead = withStyles(theme => ({
  head: {
    backgroundColor: grey[100],
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class Arquitecto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: ["Nombre", "Nif"],
      selectedOption: "Nombre",
      searchQuery: "",
      canSearch: false,
      selectedAgent: null,
      encomenda: this.props.encomenda,
      encomendaActual: this.props.encomenda.EncomendaActual && this.props.encomenda.EncomendaActual.length > 0
        ? this.props.encomenda.EncomendaActual[0] : null,
      tipoBusqueda: "Colegiados"
    }
  }

  componentDidMount() {
    try {
      this.props.fetchFuncionesTipologia(this.props.activeLanguage.code,
        this.state.encomendaActual.Id_Tipo_Grupo_Tematico,
        this.state.encomendaActual.Id_Tipo_Autorizacion_Municipal);
      this.handleCanSearch(false);
      this.parseAgents();
      this.loadLoguedAgent();
    }
    catch (e) {
      console.log("ERROR", e)
    }
  }

  parseAgents() {
    let agents = this.state.encomenda.Colegiados.map((agent) => {
      if (agent) {
        agent["Porciento"] = agent.Porcentaje;
        agent["acceptTerm1"] = true;
        agent["acceptTerm2"] = true;
        if (agent.Ids_Funciones) {
          let arrayIds = agent.Ids_Funciones.split(",");
          agent["Funciones"] = arrayIds.map(f => {
            let fun = this.props.funcionesTipologia.find(x => x.id_Funcion === parseInt(f));
            if (fun)
              return fun.Codigo;
            else
              return null
          });
          agent["Funcion"] = agent.Funciones.join(",");
        }
      }
      return agent;
    })
    let newEncomenda = {};
    Object.assign(newEncomenda, this.state.encomenda);
    newEncomenda.Colegiados = agents;
    this.setState({ encomenda: newEncomenda })
  }

  handleCanSearch = cansearch => {
    this.setState({ canSearch: cansearch })
  }

  handleAdd() {
    this.handleCanSearch(true);
  }

  handleSelectedAgent(agent) {
    this.setState({ selectedAgent: agent });
  }

  addAgenteTrabajoToSelection(agent) {
    if (agent) {
      //1- Se actualiza el agente
      agent["Porcentaje"] = agent.Porciento;
      agent["Funcion"] = agent.Funciones.join(",");
      agent["PorcentajesEquitativos"] = agent.percentChecked === true ? 1 : 0;
      if (agent.Apellido1 && agent.Apellido2)
        agent["Nombre"] = `${agent.Apellido1} ${agent.Apellido2}, ${agent.Nombre}`
      agent["Ids_Funciones"] = agent.Funciones.map(value => {
        let idFuncion = this.props.funcionesTipologia.find(x => x.Codigo === value);
        if (idFuncion)
          return idFuncion.id_Funcion;
        else
          return null

      }).join(",");

      //2- Actualizar el estado del componente y con el la encomenda general
      let newEncomenda = {}
      Object.assign(newEncomenda, this.state.encomenda);
      if (newEncomenda.Colegiados.some(x => x.Nif === agent.Nif))
        newEncomenda.Colegiados = newEncomenda.Colegiados.filter(x => x.Nif !== agent.Nif);

      newEncomenda.Colegiados.push(agent);
      this.setState({ encomenda: newEncomenda });
      this.props.updateEncomenda(this.state.encomenda);
    }
    this.handleCanSearch(false);
  }

  deleteAgentSelection(id) {
    let newEncomenda = {}
    Object.assign(newEncomenda, this.state.encomenda);
    newEncomenda.Colegiados = newEncomenda.Colegiados.filter(x => x.Id_Colegiado !== id);
    this.props.updateEncomenda(newEncomenda);
    this.setState({ encomenda: newEncomenda });
  }

  editAgenteSeleccion(id) {
    let edit = this.state.encomenda.Colegiados.find(x => x.Id_Colegiado === id);
    if (edit) {
      this.handleCanSearch(true);
      this.setState({ selectedAgent: edit });
    }
  }

  existAgentSelected(id) {
    return this.state.encomenda.Colegiados.some(x => x.Id_Colegiado === id);
  }

  async loadLoguedAgent() {
    if (this.state.encomenda.Colegiados && this.state.encomenda.Colegiados.length === 0
      && this.state.Colegiados && !this.state.Colegiados.some(x => x.Id_Colegiado === this.props.loguedUser.Id_Colegiado)) {
      let search = await getBuscador(this.props.loguedUser.Id_Colegiado, this.state.tipoBusqueda, 1, 1);
      if (search && search.data && search.data[this.props.tipoBusqueda]
        && search.data[this.props.tipoBusqueda].length > 0) {
        let loguedUser = search.data[this.props.tipoBusqueda][0];
        if (loguedUser)
          this.setState({ selectedAgent: loguedUser });
      }
    }
  }

  renderSelection = () => {
    let { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Grid container >
          <Grid item md={10} className={classes.subtitle}>Arquitectos</Grid>
          <Grid item md={2}>
            <Fab size="small" color="primary" aria-label="Add"
              className={classes.fab} onClick={() => { this.handleAdd() }}>
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.headHeight}>
              <CustomTableHead className="text-uppercase px-3">NIF</CustomTableHead>
              <CustomTableHead className="p-0 text-center text-uppercase">
                <Translate id="languages.agentes.tableColumnName" />
              </CustomTableHead>
              <CustomTableHead className="px-3 text-center text-uppercase">%</CustomTableHead>
              <CustomTableHead className="p-0 text-center text-uppercase">
                <Translate id="languages.agentes.tableColumnFunction" />
              </CustomTableHead>
              <CustomTableHead></CustomTableHead>
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBodyHeight}>
            {
              this.state.encomenda.Colegiados.length === 0 ?
                <TableRow>
                  <TableCell colSpan={5}></TableCell>
                </TableRow>
                : this.state.encomenda.Colegiados.map((row, index) => {
                  return (
                    <TableRow className={`${classes.row}`} key={index}>
                      <TableCell component="th" scope="row" className="px-1 text-center">
                        {row.Nif}
                      </TableCell>
                      <TableCell className="p-0 text-center">{row.Nombre}</TableCell>
                      <TableCell className="p-3 text-center">{row.Porciento ? `${row.Porciento}` : ""}</TableCell>
                      <TableCell className="p-0 text-center">{row.Funcion}</TableCell>
                      <TableCell className="p-0 button-column-static">
                        <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary"
                          onClick={() => this.editAgenteSeleccion(row.Id_Colegiado)}>
                          <EditIcon />
                        </IconButton >
                        <IconButton className={classes.buttonEdit} color="primary" aria-label="Delete"
                          onClick={() => this.deleteAgentSelection(row.Id_Colegiado)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }

  renderSearchBox = () => {
    return (
      this.state.canSearch &&
      <div>
        <SearchAgents tipoBusqueda={this.state.tipoBusqueda} selectAgent={(selectAgent) => { this.handleSelectedAgent(selectAgent) }}
          handleAddAgent={() => { this.handleCanSearch(false) }} allowAdd={false} />

        {this.state.selectedAgent &&
          <FormArquitecto key={this.state.selectedAgent.Nif} arquitecto={this.state.selectedAgent}
            funcionesTipologia={this.props.funcionesTipologia} handleCanSearch={() => this.handleSelectedAgent(null)}
            addAgenteTrabajoToSelection={agent => { this.addAgenteTrabajoToSelection(agent); this.handleSelectedAgent(null); }}
            existAgentSelected={agent => this.existAgentSelected(agent)} />
        }
      </div>
    );
  }

  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          {this.renderSelection()}
        </Grid>

        <Grid item xs={12}>
          {this.renderSearchBox()}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  funcionesTipologia: state.trabajos.funcionesTipologia.data ? state.trabajos.funcionesTipologia.data.Tipos_Trabajos_Tunciones : [],
  loguedUser: state.user.DatosUsuarioValidado,
  state
})

const mapDispatchToProps = {
  fetchFuncionesTipologia: fetchFuncionesTipologia,
};

Arquitecto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(Arquitecto)));