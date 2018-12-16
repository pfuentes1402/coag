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
import { fetchBuscador } from '../../../actions/expedientes/index';
import { fetchFuncionesTipologia, dispatchAddAgenteTrabajoSeleccion, 
  dispatchDeleteAgenteTrabajoSeleccion,dispatchEditAgenteTrabajoSeleccion} 
  from '../../../actions/trabajos/index';
import '../indexstyle.css';

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
  iconoption:{
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
      percent: "",
      percentChecked: false,
      acceptTerm1: false,
      acceptTerm2: false,
      functionsSelected : []
    }
  }

  componentDidMount() {
    try{
      this.props.fetchFuncionesTipologia(1);
      this.props.fetchBuscador(this.props.loguedUser.Id_Colegiado, "colegiados");
      this.handleCanSearch(false);
    }
    catch (e){
      console.log("ERROR",e)
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

  addFunctionToAgent = (functionCode) => (event) =>{
    let tag = event.target.tagName === "SPAN"? event.target.parentNode : event.target;
    if(!this.state.functionsSelected.some(x=> x=== functionCode)){
      let funcion = this.props.funcionesTipologia.find(x=> x.Codigo === functionCode);
      this.state.functionsSelected.push(functionCode);
      tag.className = tag.className + " slectedFunction";
    }
    else{
      let selections = this.state.functionsSelected.filter(x=> x !== functionCode);
      this.setState({functionsSelected: selections});
      tag.className = tag.className.replace("slectedFunction","");
    }
  }

  handlePercentChange = (event) => {
    this.setState({ percent: event.target.value });
  }

  handleCheckedPersentChange = event => {
    this.setState({ percentChecked: event.target.checked });
  };

  handleTerm1Change = event => {
    this.setState({ acceptTerm1: event.target.checked });
  };

  handleTerm2Change = event => {
    this.setState({ acceptTerm2: event.target.checked });
  };

  async handleSearch() {
    if (this.state.searchQuery !== "") {
      await this.props.fetchBuscador(this.state.searchQuery, "colegiados");
    }
  }

  addAgenteTrabajoToSelection(id){
    let agente = this.props.colegiadosSearchResult.find(x => x.Id_Colegiado === id);
    if(agente){
      if(this.props.agentesTrabajoSelected.some(x=> x.Id_Colegiado === id)){
        this.deleteAgentSelection(id);
      }
      agente.Porciento = this.state.percent;
      agente.Funciones = this.state.functionsSelected;

      //TODO: Sacar el idExpediente y el idTrabajo de los estados de redux
      this.props.addAgenteTrabajoSeleccion("703377","1",agente);
    }
    this.handleCanSearch(false);
  }

  deleteAgentSelection(id){
    this.props.deleteAgenteTrabajoSeleccion(id);
  }

  editAgenteSeleccion(id){
    let edit = this.props.agentesTrabajoSelected.find(x=> x.Id_Colegiado === id);
    if(edit){
      this.setState(
        {
          percent: edit.Porciento,
          functionsSelected:edit.Funciones, 
          acceptTerm1: true, 
          acceptTerm2: true
        });
      this.props.editAgenteTrabajoSeleccion(edit.Agente);
      this.handleCanSearch(true);
    }
  }

  renderSelection = () => {
    let { classes } = this.props;
    return(
          <Paper className={classes.root}>
            <Grid container >
              <Grid item md={10} className={classes.subtitle}>Arquitectos</Grid>
              <Grid item md={2}>
                <Fab size="small" color="primary" aria-label="Add"
                  className={classes.fab} onClick={() => { this.handleCanSearch(true) }}>
                  <AddIcon />
                </Fab>
              </Grid>
            </Grid>
            <Table className={classes.table}>
              <TableHead>
                <TableRow className={classes.headHeight}>
                  <CustomTableHead className="text-uppercase px-3">NIF</CustomTableHead>
                  <CustomTableHead className="p-0 text-center text-uppercase">
                      <Translate id="languages.agentes.tableColumnName"/>
                  </CustomTableHead>
                  <CustomTableHead className="p-3 text-center text-uppercase">%</CustomTableHead>
                  <CustomTableHead className="p-0 text-center text-uppercase">
                      <Translate id="languages.agentes.tableColumnFunction"/>
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
                          <TableCell component="th" scope="row" className="p-0 text-center">
                            {row.Nif}
                          </TableCell>
                          <TableCell className="p-0 text-center">{row.Nombre}</TableCell>
                          <TableCell className="p-3 text-center">{row.Porciento? `${row.Porciento}%` : ""}</TableCell>
                          <TableCell className="p-0 text-center">
                            <Grid item xs={12} className="text-center">
                              {row.Funciones.map((funct,indexFunct)=>{
                                return <span key={indexFunct}>
                                  {`${funct} ${row.Funciones.length === (indexFunct + 1) ? "" : ", "}`}
                                </span>
                              })}
                            </Grid>
                          </TableCell>
                          <TableCell className="p-0">
                              <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary"
                                 onClick={() => this.editAgenteSeleccion(row.Id_Colegiado)}>
                                <EditIcon />
                              </IconButton >
                              <IconButton className={classes.buttonEdit} color="primary" aria-label="Delete" onClick={()=> this.deleteAgentSelection(row.Id_Colegiado)}>
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
            label={<Translate id="languages.agentes.searchLabelBox"/>}
            className={classes.textField}>
          </TextField>

          <TextField
            select
            label={<Translate id="languages.agentes.searchLabelOption"/>}
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
            <Button color="primary" size="small" className={classes.button}
              onClick={() => { this.handleCanSearch(false) }}>
              <Translate id="languages.generalButton.cancel"/><Close className={classes.rightIcon} />
            </Button>
            <Button variant="contained" size="small" color="primary" className={classes.button}
              onClick={() => this.handleSearch()}>
              <Translate id="languages.agentes.search"/><Search className={classes.rightIcon} />
            </Button>
          </Grid>
        </Paper>
        : <div></div>
    );
  }

  renderSearchResult = () => {
    let { classes } = this.props;
    return (
      this.state.canSearch ? this.props.colegiadosSearchResult.map((value, index) => {
        return <Grid item xs={12} key={index}>
          <Paper key={index} className={classes.resultPanel}>
            <Grid container spacing={24}>
              <Grid item xs={8}>
                <Typography variant="h6" gutterBottom>Datos del Arquitecto</Typography>
                <Typography variant="body2" className={classes.subtitleData}>NIF</Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Nif}</Typography>

                <Typography variant="body2" className={classes.subtitleData}>
                    <Translate id="languages.agentes.tableColumnName"/>
                </Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Nombre}</Typography>

                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                    <Translate id="languages.agentes.firstName"/>
                </Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Apellido1}</Typography>

                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                    <Translate id="languages.agentes.secondName"/>
                </Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Apellido2}</Typography>

                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                    <Translate id="languages.agentes.observations"/>
                </Typography>
                <Typography variant="subtitle2" gutterBottom></Typography>
              </Grid>

              <Grid item xs={4}>
                <UserIcon className={classes.usericon} color="secondary" />
              </Grid>

              <Grid item xs={12} className="functionTipology">
                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                  <Translate id="languages.agentes.functionsTitle"/> *
                </Typography>
                {
                  this.props.funcionesTipologia.map((value, index) => {
                    return <Button onClick={this.addFunctionToAgent(value.Codigo)} 
                      className={this.state.functionsSelected.some(x=> x === value.Codigo) ? "slectedFunction": ""}
                      variant="contained"
                      key={index}>{value.Codigo}
                    </Button>
                  })
                }
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                    <Translate id="languages.agentes.percentTitle"/>
                </Typography>
                <Grid container spacing={0}>
                  <Grid item xs={5}>
                    <TextField
                      label="%"
                      className={classes.mt0}
                      value={this.state.percent}
                      placeholder="Ej 25"
                      type="number"
                      onChange={this.handlePercentChange}
                      margin="normal" />
                  </Grid>
                  <Grid item xs={7}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.percentChecked}
                          onChange={this.handleCheckedPersentChange}
                          color="primary" />
                      }
                      label={<Translate id="languages.agentes.percentLabel"/>}/>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.acceptTerm1}
                      onChange={this.handleTerm1Change}
                      color="primary" />
                  }
                  label={<Translate id="languages.agentes.conditionTermn1"/>} />

                  <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.acceptTerm2}
                      onChange={this.handleTerm2Change}
                      color="primary" />
                  }
                  label={<Translate id="languages.agentes.conditionTermn2"/>} />
              </Grid>

              <Grid item xs={12} className="text-right">
                <Button color="primary" size="small" className={classes.button}
                  onClick={() => { this.handleCanSearch(false) }}>
                  <Translate id="languages.generalButton.cancel"/><Close className={classes.rightIcon} />
                </Button>
                <Button variant="contained" size="small" color="primary" className={classes.button}
                  onClick={()=> this.addAgenteTrabajoToSelection(value.Id_Colegiado)} 
                  disabled={this.state.acceptTerm1 && this.state.acceptTerm2 && (this.state.percent !== "" || this.state.percentChecked) ? false : true}>
                  <Translate id="languages.generalButton.added"/>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      })
        : <div></div>
    );
  }

  renderNavigationButtons = () =>{
    let { classes } = this.props;
    return(
      <div>Buttons sections</div>
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
  colegiadosSearchResult : state.trabajos.colegiadosAgentesTrabajo ? state.trabajos.colegiadosAgentesTrabajo : [],
  loguedUser: state.user.DatosUsuarioValidado
})

const mapDispatchToProps = {
  /**Hacer la busqueda dado un id o un query (filtro= nif o nombre, tipoBusqueda = otrosagentes) */
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