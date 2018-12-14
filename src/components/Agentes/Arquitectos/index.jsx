import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
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

  addFunctionToAgent = (nif, functionCode) => (event) =>{
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

  handlePercentChange = nif => (event) => {
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
      await this.props.fetchBuscador(this.state.searchQuery, "otrosagentes");
    }
  }

  addAgenteTrabajoToSelection(nif){
    let agente = this.props.agentsSearchResult.find(x => x.Nif === nif);
    if(agente){
      if(this.props.agentesTrabajoSelected.some(x=> x.Nif === nif)){
        this.deleteAgentSelection(nif);
      }
      agente.Porciento = this.state.percent;
      agente.Funciones = this.state.functionsSelected;

      //TODO: Sacar el idExpediente y el idTrabajo de los estados de redux
      this.props.addAgenteTrabajoSeleccion("703377","1",agente);
    }
    this.handleCanSearch(false);
  }

  deleteAgentSelection(nif){
    this.props.deleteAgenteTrabajoSeleccion(nif);
  }

  editAgenteSeleccion(nif){
    let edit = this.props.agentesTrabajoSelected.find(x=> x.Nif === nif);
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
                  <CustomTableHead className="text-uppercase">NIF</CustomTableHead>
                  <CustomTableHead className="p-0 text-center text-uppercase">Nombre</CustomTableHead>
                  <CustomTableHead className="p-3 text-center text-uppercase">%</CustomTableHead>
                  <CustomTableHead className="p-0 text-center text-uppercase">Función</CustomTableHead>
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
                              <Fab size="small" aria-label="Edit" className={classes.iconoption}
                                 onClick={() => this.editAgenteSeleccion(row.Nif)}>
                                <EditIcon color="primary"/>
                              </Fab>
                              <Fab size="small" aria-label="Delete" onClick={()=> this.deleteAgentSelection(row.Nif)}>
                                <DeleteIcon color="primary"/>
                              </Fab>
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
            label="Introduce términos de búsqueda"
            className={classes.textField}>
          </TextField>

          <TextField
            select
            label="Opción de búsqueda"
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
              Cancelar<Close className={classes.rightIcon} />
            </Button>
            <Button variant="contained" size="small" color="primary" className={classes.button}
              onClick={() => this.handleSearch()}>
              Buscar<Search className={classes.rightIcon} />
            </Button>
          </Grid>
        </Paper>
        : <div></div>
    );
  }

  renderSearchResult = () => {
    let { classes } = this.props;
    return (
      this.state.canSearch ? this.props.agentsSearchResult.map((value, index) => {
        return <Grid item xs={12} key={index}>
          <Paper key={index} className={classes.resultPanel}>
            <Grid container spacing={24}>
              <Grid item xs={8}>
                <Typography variant="h6" gutterBottom>{value.Mail}</Typography>
                <Typography variant="body2" className={classes.subtitleData}>NIF</Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Nif}</Typography>

                <Typography variant="body2" className={classes.subtitleData}>NOMBRE</Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Nombre}</Typography>

                <Typography variant="body2" className={classes.subtitleData}>PRIMER APELLIDO</Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Apellido1}</Typography>

                <Typography variant="body2" className={classes.subtitleData}>SEGUNDO APELLIDO</Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Apellido2}</Typography>

                <Typography variant="body2" className={classes.subtitleData}>OBSERVACIONES</Typography>
                <Typography variant="subtitle2" gutterBottom></Typography>
              </Grid>

              <Grid item xs={4}>
                <UserIcon className={classes.usericon} color="secondary" />
              </Grid>

              <Grid item xs={12} className="functionTipology">
                <Typography variant="body2" className={classes.subtitleData}>
                  FUNCIONES COMPATIBLES CON LA TIPOLOGÍA *
                </Typography>
                {
                  this.props.funcionesTipologia.map((value, index) => {
                    return <Button onClick={this.addFunctionToAgent(0, value.Codigo)} 
                      className={this.state.functionsSelected.some(x=> x === value.Codigo) ? "slectedFunction": ""}
                      variant="contained"
                      key={index}>{value.Codigo}
                    </Button>
                  })
                }
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" className={classes.subtitleData}>PORCENTAGE</Typography>
                <Grid container spacing={0}>
                  <Grid item xs={5}>
                    <TextField
                      label="%"
                      className={classes.mt0}
                      value={this.state.percent}
                      placeholder="Ej 25"
                      type="number"
                      onChange={this.handlePercentChange(value.Nif)}
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
                      label="Porcntaje equitativo con el resto de los Arquitectos" />
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
                  label="Declaro formalmente y bajo mi responsabilidad que no desempeño cargo funcional, o
                  en caso de ejercerlo dispongo de las autorizaciones que exigen la Ley de incopatibilidades
                  53/1984 de 26 de diciembre y reglamentos que sean aplicables." />

                  <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.acceptTerm2}
                      onChange={this.handleTerm2Change}
                      color="primary" />
                  }
                  label="Tal y como se establece en el preámbulo del RD1000/2010 en el caso de que el trabajo
                  que se tramita contenga documentación que no esté sujeta a la exigencia de visado colegial,
                  ese declara que el visado voluntario de dicha documentación se solicita por petición expresa del cliente" />
              </Grid>

              <Grid item xs={12} className="text-right">
                <Button color="primary" size="small" className={classes.button}
                  onClick={() => { this.handleCanSearch(false) }}>
                  Cancelar<Close className={classes.rightIcon} />
                </Button>
                <Button variant="contained" size="small" color="primary" className={classes.button}
                  onClick={()=> this.addAgenteTrabajoToSelection(value.Nif)} 
                  disabled={this.state.acceptTerm1 && this.state.acceptTerm2 && (this.state.percent !== "" || this.state.percentChecked) ? false : true}>
                  AÑADIR
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
    {
      console.log("this.props", this.props);
      console.log("this.state", this.state);
    }
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
  funcionesTipologia: state.trabajos.funcionesTipologia.data ? state.trabajos.funcionesTipologia.data.Tipos_Trabajos_Funciones : []
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Arquitecto));