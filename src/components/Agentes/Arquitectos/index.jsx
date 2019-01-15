import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import Typography from '@material-ui/core/Typography';
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
import UserIcon from '@material-ui/icons/SupervisedUserCircle';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchBuscador } from '../../../actions/expedientes/index';
import TablePagination from '@material-ui/core/TablePagination';
import {
  fetchFuncionesTipologia, dispatchAddAgenteTrabajoSeleccion,
  dispatchDeleteAgenteTrabajoSeleccion, dispatchEditAgenteTrabajoSeleccion
}
  from '../../../actions/trabajos/index';
import '../indexstyle.css';
import FormArquitecto from './arquitecto';

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
      isSearch: false,

      currentPage: 0,
      rowsPerPage: 5,
      totalRecords: 1,
      totalPages: 4,
      showPagination: false,
    }
  }

  componentDidMount() {
    try {
      this.props.fetchFuncionesTipologia(1);
      this.props.fetchBuscador(this.props.loguedUser.Id_Colegiado, "colegiados");
      this.handleCanSearch(false);
    }
    catch (e) {
      console.log("ERROR", e)
    }
  }

  handleSelectOptionChange = event => {
    this.setState({
      selectedOption: event.target.value,
    });
  };

  handleSearchQueryChange = event => {
    this.setState({
      searchQuery: event.target.value
    });
  }

  handleCanSearch = cansearch => {
    this.setState({ canSearch: cansearch })
  }

  handlePagination = showPag => {
    this.setState({ showPagination: showPag });
  }

  handleAdd() {
    this.handleCanSearch(true);
  }

  async handleSearch(currentPage = 0, searchQuery = "") {
    let searchString = this.state.searchQuery !== "" ? this.state.searchQuery : searchQuery.toString();
    if (searchString !== "") {
      this.setState({ isSearch: true });
      let searchResult = await this.props.fetchBuscador(searchString, "colegiados", (currentPage + 1), this.state.rowsPerPage);

      let pagination = searchResult.data ? searchResult.data.Paginacion[0] : null;
      this.handlePagination(true);
      this.setState({
        isSearch: false,
        currentPage: currentPage,
        totalRecords: pagination ? pagination.Numero_Total_Registros : this.state.totalRecords,
        totalPages: pagination ? pagination.Numero_Paginas : this.state.totalPages
      });
    }
  }

  addAgenteTrabajoToSelection(agent) {
    if (agent) {
      if (this.props.agentesTrabajoSelected.some(x => x.Id_Colegiado === agent.Id_Colegiado)) {
        this.deleteAgentSelection(agent.Id_Colegiado);
      }
      //Adicionando el agente al estdo de redux
      this.props.addAgenteTrabajoSeleccion("", "", agent);
    }
    this.handleCanSearch(false);
    this.handlePagination(false);
  }

  deleteAgentSelection(id) {
    this.props.deleteAgenteTrabajoSeleccion(id);
  }

  editAgenteSeleccion(id) {
    let edit = this.props.agentesTrabajoSelected.find(x => x.Id_Colegiado === id);
    if (edit) {
      let properties = {
        Id_Colegiado: edit.Id_Colegiado,
        Nif: edit.Nif,
        percent: edit.Porciento,
        functionsSelected: edit.Funciones,
        acceptTerm1: true,
        acceptTerm2: true
      };
      this.props.editAgenteTrabajoSeleccion(edit.Agente);
      this.handleCanSearch(true);
      this.handlePagination(false);
      this.setState({ changedProperties: [properties, ...this.state.changedProperties] });
    }
  }

  handleChangePage = async (event, page) => {
    this.state.currentPage = page;
    await this.handleSearch(page);
  };

  handleChangeRowsPerPage = async (event) => {
    this.state.rowsPerPage = event.target.value;
    await this.handleSearch(0);
  };

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
              this.props.agentesTrabajoSelected.length === 0 ?
                <TableRow>
                  <TableCell colSpan={5}></TableCell>
                </TableRow>
                : this.props.agentesTrabajoSelected.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell component="th" scope="row" className="px-1 text-center">
                        {row.Nif}
                      </TableCell>
                      <TableCell className="p-0 text-center">{row.Nombre}</TableCell>
                      <TableCell className="p-3 text-center">{row.Porciento ? `${row.Porciento}%` : ""}</TableCell>
                      <TableCell className="p-0 text-center">
                        <Grid item xs={12} className="text-center">
                          {row.Funciones.map((funct, indexFunct) => {
                            return <span key={indexFunct}>
                              {`${funct} ${row.Funciones.length === (indexFunct + 1) ? "" : ", "}`}
                            </span>
                          })}
                        </Grid>
                      </TableCell>
                      <TableCell className="p-0 button-column-static">
                        <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary"
                          onClick={() => this.editAgenteSeleccion(row.Id_Colegiado)}>
                          <EditIcon />
                        </IconButton >
                        <IconButton className={classes.buttonEdit} color="primary" aria-label="Delete" onClick={() => this.deleteAgentSelection(row.Id_Colegiado)}>
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
    let { classes } = this.props;
    return (
      this.state.canSearch ?
        <Paper className={classes.centerText}>
          <TextField
            value={this.state.searchQuery}
            onChange={this.handleSearchQueryChange}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.handleSearch();
              }
            }}
            label={<Translate id="languages.agentes.searchLabelBox" />}
            className={classes.textField}>
          </TextField>

          <TextField
            select
            label={<Translate id="languages.agentes.searchLabelOption" />}
            className={classes.textField}
            value={this.state.selectedOption}
            onChange={this.handleSelectOptionChange}>
            {['Nif', 'Nombre'].map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <Grid item xs={12} className={classes.paddingButtons}>
            <div style={{ display: "inline-flex", alignItems: "center" }}>
              <Button color="primary" size="small" className={classes.button}
                onClick={() => { this.handleCanSearch(false) }}>
                <Translate id="languages.generalButton.cancel" /><Close className={classes.rightIcon} />
              </Button>
              <Button variant="contained" size="small" color="primary" className={classes.button}
                onClick={() => this.handleSearch()}>
                <Translate id="languages.agentes.search" /><Search className={classes.rightIcon} />
              </Button>

              {this.state.isSearch ? <CircularProgress size={24} /> : ""}
            </div>
          </Grid>
        </Paper>
        : <div></div>
    );
  }

  renderPagination = () => {
    return (
      this.state.showPagination ?
        <Grid item xs={12} className="float-right">
          <TablePagination labelRowsPerPage={<Translate id="languages.promotores.itemsPerPage" />}
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={this.state.totalRecords}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.currentPage}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Grid>
        : <Grid item xs={12}></Grid>
    );
  }

  renderSearchResult = () => {
    return (
      <Grid container spacing={8} className="p-1">
        {this.renderPagination()}
        {
          this.state.canSearch && !this.state.isSearch && this.props.colegiadosSearchResult && this.props.colegiadosSearchResult.length > 0
          && this.props.colegiadosSearchResult.map((value, index) => {
            return <FormArquitecto key={index} arquitecto={value}
              funcionesTipologia={this.props.funcionesTipologia} handleCanSearch={search => this.handleCanSearch(search)}
              addAgenteTrabajoToSelection={agent => this.addAgenteTrabajoToSelection(agent)} />
          })
        }
        {this.renderPagination()}
      </Grid>
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

        {this.renderSearchResult()}
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  trabajos: state.trabajos,
  agentesTrabajoSelected: state.trabajos.agentesTrabajoSelected ? state.trabajos.agentesTrabajoSelected : [],
  agentsSearchResult: state.trabajos.OtrosAgentesTrabajoSelec ? state.trabajos.OtrosAgentesTrabajoSelec : [],
  funcionesTipologia: state.trabajos.funcionesTipologia.data ? state.trabajos.funcionesTipologia.data.Tipos_Trabajos_Funciones : [],
  colegiadosSearchResult: state.trabajos.colegiadosAgentesTrabajo ? state.trabajos.colegiadosAgentesTrabajo : [],
  loguedUser: state.user.DatosUsuarioValidado
})

const mapDispatchToProps = {
  fetchBuscador: fetchBuscador,
  fetchFuncionesTipologia: fetchFuncionesTipologia,
  addAgenteTrabajoSeleccion: dispatchAddAgenteTrabajoSeleccion,
  deleteAgenteTrabajoSeleccion: dispatchDeleteAgenteTrabajoSeleccion,
  editAgenteTrabajoSeleccion: dispatchEditAgenteTrabajoSeleccion
};

Arquitecto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(Arquitecto)));