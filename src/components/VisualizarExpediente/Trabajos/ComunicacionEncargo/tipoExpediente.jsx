import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Typography, Grid, Paper, Button, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { Table, TableCell, TableHead, TableBody, TableRow, Fab, IconButton, Divider } from '@material-ui/core';
import { Add, Edit, Delete, Check, Close } from '@material-ui/icons';
import PropTypes from 'prop-types';
import AddAgente from './addAgente';
import FormArquitecto from '../../../Agentes/Arquitectos/arquitecto';

const styles = theme => ({
  divGrey: {
    backgroundColor: grey[100],
    margin: 16
  },
  backgroundGrey: {
    backgroundColor: grey[100]
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%",
    textAlign: 'left',
    marginTop: 5
  },
  headHeight: {
    height: 40
  },
  table: {
    minWidth: 200,
  },
  tableBodyHeight: {
    minHeight: 100
  },
  fab: {
    margin: theme.spacing.unit,
    marginTop: 25,
    position: 'absolute',
    marginLeft: 40
  },
  tableBorder: {
    border: "2px solid " + grey[200]
  },
  buttonEdit: {
    border: "1.2px solid",
    margin: 2,
    padding: 6,
  },
  withoutRadius: {
    borderRadius: 0
  },
  headerBorder: {
    border: "2px solid " + grey[200],
    borderBottom: 0
  }
});

const CustomTableHead = withStyles(theme => ({
  head: {
    backgroundColor: grey[100],
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14,
  }
}))(TableCell);

class TipoExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceExpediente: this.props.sourceExpediente,
      expediente: this.props.expediente,
      canAddAgent: false,
      editAgent: null
    }
  }

  componentWillMount() {
    this.parseAgents();
  }

  parseAgents() {
    let agents = this.state.expediente.Colegiados.map((agent, index) => {
      if (agent) {
        agent["Porciento"] = agent.Porcentaje;
        agent["acceptTerm1"] = true;
        agent["acceptTerm2"] = true;
        if (agent.Funcion)
          agent["Funciones"] = agent.Funcion.split(",");
      }
      return agent;
    })
    let expedient = this.state.expediente;
    expedient.Colegiados = agents;
    this.setState({ expediente: expedient })
  }

  handleAddAgent(action) {
    this.setState({ canAddAgent: action });
  }

  editAgentToExpedient(agent) {
    this.handleAddAgent(false);
    if (agent) {
      this.setState({ editAgent: agent });
    }
    else {
      this.setState({ editAgent: null });
    }
  }

  addAgentToExpediente(agent) {
    if (agent) {
      //1- Se actualiza el agente
      agent["Porcentaje"] = agent.Porciento;
      agent["Funcion"] = agent.Funciones.join(", ");
      //2- TODO:Se consume el servicio que actualiza los colegiados en un expediente

      //3- Si el response es success -> actualizar el estado del componente
      let newExpedient = {}
      Object.assign(newExpedient, this.state.expediente);
      newExpedient.Colegiados = newExpedient.Colegiados.filter(x => x.Nif != agent.Nif);
      newExpedient.Colegiados.push(agent);
      this.setState({ expediente: newExpedient });
      this.editAgentToExpedient(null);
    }
  }

  deleteAgentToExpediente(agent) {
    //1- TODO:Se consume el servicio que actualiza los colegiados en un expediente

    //2- Actualizar el estado local si se realiza correctamente la operacion
    let newExpedient = {}
    Object.assign(newExpedient, this.state.expediente);
    newExpedient.Colegiados = newExpedient.Colegiados.filter(x => x.Nif != agent.Nif);
    this.setState({ expediente: newExpedient });
  }

  renderAgentsTable() {
    let { classes } = this.props;
    return (
      <div className="p-2">
        <Grid container className={classes.headerBorder}>
          <Grid item md={10}>
            <Typography variant="subtitle1" gutterBottom className="m-2">
              <Translate id="languages.fichaExpediente.titleAgents" />
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Fab size="small" color="primary" aria-label="Add" onClick={() => this.handleAddAgent(true)}
              className={classes.fab}> <Add />
            </Fab>
          </Grid>
        </Grid>

        <Table className={`${classes.table} ${classes.tableBorder}`}>
          <TableHead>
            <TableRow className={classes.headHeight}>
              <CustomTableHead className="text-uppercase px-3">Nif</CustomTableHead>
              <CustomTableHead className="text-uppercase">
                <Translate id="languages.fichaExpediente.tableColumnName" />
              </CustomTableHead>
              <CustomTableHead className="px-2 text-uppercase">%</CustomTableHead>
              <CustomTableHead className="text-uppercase px-1 text-center">
                <Translate id="languages.fichaExpediente.tableColumnFunctions" />
              </CustomTableHead>
              <CustomTableHead className="text-uppercase px-1"></CustomTableHead>
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBodyHeight}>
            {
              this.state.expediente.Colegiados.length === 0 ?
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                </TableRow>
                : this.state.expediente.Colegiados.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell component="th" scope="row" className="px-1 text-center">
                        {row.Nif}
                      </TableCell>
                      <TableCell className="pl-3">{row.Nombre}</TableCell>
                      <TableCell className="px-2">{row.Porcentaje}</TableCell>
                      <TableCell className="px-1 text-center">{row.Funcion}</TableCell>
                      <TableCell className="px-1" style={{ width: 100 }}>
                        <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary"
                          onClick={() => this.editAgentToExpedient(row)}>
                          <Edit />
                        </IconButton>
                        <IconButton className={classes.buttonEdit} color="primary" aria-label="Delete"
                          onClick={() => this.deleteAgentToExpediente(row)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>

        {this.state.canAddAgent && <AddAgente handleAddAgent={action => this.handleAddAgent(action)}
          addAgentToExpediente={agent => this.addAgentToExpediente(agent)} />}
      </div>
    );
  }

  renderPromotorsTable() {
    let { classes } = this.props;
    return (
      <div className="p-2">
        <Grid container className={classes.headerBorder}>
          <Grid item md={10}>
            <Typography variant="subtitle1" gutterBottom className="m-2">
              <Translate id="languages.fichaExpediente.titlePromotors" />
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Fab size="small" color="primary" aria-label="Add"
              className={classes.fab}>
              <Add />
            </Fab>
          </Grid>
        </Grid>

        <Table className={`${classes.table} ${classes.tableBorder}`}>
          <TableHead>
            <TableRow className={classes.headHeight}>
              <CustomTableHead className="text-uppercase px-3">Nif</CustomTableHead>
              <CustomTableHead className="text-uppercase">
                <Translate id="languages.fichaExpediente.tableColumnName" />
              </CustomTableHead>
              <CustomTableHead className="pl-3 text-uppercase">%</CustomTableHead>
              <CustomTableHead className="text-uppercase px-3"></CustomTableHead>
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBodyHeight}>
            {
              this.props.expediente.Promotores.length === 0 ?
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                </TableRow>
                : this.props.expediente.Promotores.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell component="th" scope="row" className="px-1 text-center">
                        {row.Nif}
                      </TableCell>
                      <TableCell className="pl-3">{row.Nombre}</TableCell>
                      <TableCell className="p-3">{row.Porcentaje}</TableCell>
                      <TableCell className="px-1" style={{ width: 100 }}>
                        <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton className={classes.buttonEdit} color="primary" aria-label="Delete">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
      </div>
    );
  }

  render() {
    let { classes } = this.props;
    return (
      <Paper className={`${classes.withoutRadius} m-3`}>
        <Grid container spacing={16} className="my-3 p-2">
          <Grid item xs={12} className="p-0">
            <Typography variant="subtitle1" gutterBottom className="mx-2 my-1">
              <Translate id="languages.fichaExpediente.titleExpedientType" />
            </Typography>
            <Divider style={{ height: 3 }} />
          </Grid>

          <Grid container spacing={16}>
            <Grid item xs={12} className="p-4 mr-3">
              <TextField
                value={this.state.sourceExpediente.Descripcion_Encomenda_Actual}
                label={<Translate id="languages.fichaExpediente.titleExpedientType" />}
                className={`${classes.textField} mt-3 text-uppercase`}
                disabled={true}
                name="expedientType" />
            </Grid>

            <Grid item xs={12} className="mx-3">
              {this.renderPromotorsTable()}
            </Grid>

            <Grid item xs={12} className="mx-3">
              {this.renderAgentsTable()}
            </Grid>

            <Grid item xs={12} className="mx-3 px-3">
              {
                this.state.editAgent && <FormArquitecto funcionesTipologia={this.props.funcionesTipologia}
                  handleCanSearch={() => this.editAgentToExpedient(null)} arquitecto={this.state.editAgent}
                  addAgenteTrabajoToSelection={agent => this.addAgentToExpediente(agent)} />
              }
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  funcionesTipologia: state.trabajos.funcionesTipologia.data ? state.trabajos.funcionesTipologia.data.Tipos_Trabajos_Funciones : [],
})

const mapDispatchToProps = {

};

TipoExpediente.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(TipoExpediente)));