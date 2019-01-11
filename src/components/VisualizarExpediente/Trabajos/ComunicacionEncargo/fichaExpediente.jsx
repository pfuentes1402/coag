import React, { Component } from 'react';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { withStyles, Grid, Button, Paper, Typography, Divider, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { grey } from '@material-ui/core/colors';
import moment from 'moment';
import { Table, TableCell, TableHead, TableBody, TableRow, Fab, IconButton } from '@material-ui/core';
import { Add, Edit, Delete } from '@material-ui/icons';
import { dispatchEditExpedienteEnTrabajo } from '../../../../actions/expedientes';

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

class FichaExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  handleChangeDataExpedient = (propertyName) => (event) => {
    let expedienteCopy = {};
    Object.assign(expedienteCopy, this.props.sourceExpediente);
    expedienteCopy[propertyName] = event.target.value;
    this.props.editExpedienteEnTrabajo(expedienteCopy);
  }



  renderUbicationTable() {
    let { classes } = this.props;
    return (
      <div className="p-2">
        <Grid container >
          <Grid item md={10}>
            <Typography variant="subtitle1" gutterBottom className="m-2">
              <Translate id="languages.fichaExpediente.titleUbication" />
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
              <CustomTableHead className="text-uppercase px-3">
                <Translate id="languages.fichaExpediente.tableLabelStret" />
              </CustomTableHead>
              <CustomTableHead className="text-uppercase">N</CustomTableHead>
              <CustomTableHead className="pl-3 text-uppercase">
                <Translate id="languages.fichaExpediente.tableLabelPiso" />
              </CustomTableHead>
              <CustomTableHead className="text-uppercase px-3">CP</CustomTableHead>
              <CustomTableHead className="text-uppercase px-3">
                <Translate id="languages.fichaExpediente.tableLabelMunicipe" />
              </CustomTableHead>
              <CustomTableHead className="text-uppercase px-3"></CustomTableHead>
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBodyHeight}>
            {
              this.props.expediente.Emplazamientos.length === 0 ?
                <TableRow>
                  <TableCell colSpan={6}></TableCell>
                </TableRow>
                : this.props.expediente.Emplazamientos.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell component="th" scope="row" className="px-1 text-center">
                        {row.Calle}
                      </TableCell>
                      <TableCell className="pl-3">{row.Numero}</TableCell>
                      <TableCell className="p-3">{row.Piso}</TableCell>
                      <TableCell className="p-0">{row.Codigo_Postal}</TableCell>
                      <TableCell className="p-0">{row.Concello}</TableCell>
                      <TableCell className="px-2">
                        <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary">
                          <Edit />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>

        <Grid item xs={8}>
          <TextField
            id="standard-name"
            label={<Translate id="languages.fichaExpediente.labelAlias" />}
            className={classes.textField}
            placeholder="Sin definir"
            value={this.props.sourceExpediente.Antecedente}
            margin="normal" />
        </Grid>
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
                      <TableCell className="px-2">
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
              <CustomTableHead className="px-2 text-uppercase">%</CustomTableHead>
              <CustomTableHead className="text-uppercase px-1 text-center">
                <Translate id="languages.fichaExpediente.tableColumnFunctions" />
              </CustomTableHead>
              <CustomTableHead className="text-uppercase px-1"></CustomTableHead>
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBodyHeight}>
            {
              this.props.expediente.Colegiados.length === 0 ?
                <TableRow>
                  <TableCell colSpan={4}></TableCell>
                </TableRow>
                : this.props.expediente.Colegiados.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell component="th" scope="row" className="px-1 text-center">
                        {row.Nif}
                      </TableCell>
                      <TableCell className="pl-3">{row.Nombre}</TableCell>
                      <TableCell className="px-2">{row.Porcentaje}</TableCell>
                      <TableCell className="px-1 text-center">{row.Ids_Funciones}</TableCell>
                      <TableCell className="px-1">
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

  renderExpedientType() {
    let { classes } = this.props;
    let comunicacionEncargo = this.props.expediente.Expediente
      && this.props.expediente.Expediente.length > 0
      ? this.props.expediente.Expediente[0].comunicacionEncargo
      : null;
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
                value={comunicacionEncargo ? `${comunicacionEncargo.grupoTematico.title} / ${comunicacionEncargo.autorizacionMunicipal.title}` : ""}
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
          </Grid>

        </Grid>
      </Paper>
    );
  }

  render() {
    let { classes } = this.props;
    console.log("fichaExpediente", this.props);
    return (
      <div>
        <Paper className={`${classes.withoutRadius} m-3`}>
          <Grid container spacing={16} className="my-3">
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom className="mx-2 my-1">
                <Translate id="languages.fichaExpediente.titleFichaExpediente" />
              </Typography>
              <Divider style={{ height: 3 }} />
            </Grid>
            <ValidatorForm ref="form">
              <Grid container spacing={16}>
                <Grid item xs={7} className="p-4">
                  <TextValidator
                    value={this.props.sourceExpediente.Titulo}
                    label={<Translate id="languages.fichaExpediente.labelExpedienteName" />}
                    className={classes.textField}
                    validators={['required']}
                    errorMessages={[`${<Translate id="languages.fichaExpediente.requiredField" />}`]}
                    onChange={this.handleChangeDataExpedient("Titulo")}
                    name="name" />
                  <TextValidator
                    value={this.props.sourceExpediente.Expediente_Codigo_Estudio}
                    label={<Translate id="languages.fichaExpediente.labelExpedienteCode" />}
                    className={`${classes.textField} mt-3`}
                    validators={['required']}
                    errorMessages={[`${<Translate id="languages.fichaExpediente.requiredField" />}`]}
                    onChange={this.handleChangeDataExpedient("Expediente_Codigo_Estudio")}
                    name="code" />
                  <TextField
                    value={this.props.sourceExpediente.Antecedente}
                    label={<Translate id="languages.fichaExpediente.labelExpedienteAnteced" />}
                    className={`${classes.textField} mt-3`}
                    onChange={this.handleChangeDataExpedient("Antecedente")}
                    name="antecedente" />
                </Grid>
                <Grid item xs={5} className="p-4">
                  <Typography variant="subtitle1" gutterBottom className="m-0">
                    <Translate id="languages.fichaExpediente.labelEntryDate" />
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {moment(new Date(this.props.sourceExpediente.Fecha_Entrada)).format("DD/MM/YYYY")}
                  </Typography>
                </Grid>

                <Grid item xs={12} className={`${classes.divGrey} p-4`}>
                  <Typography variant="subtitle1" gutterBottom className="m-0">
                    <Translate id="languages.fichaExpediente.labelObservations" />
                  </Typography>
                  <TextField id="outlined-bare"
                    className={`${classes.textField} m-0`}
                    defaultValue={this.props.sourceExpediente.Observaciones}
                    onChange={this.handleChangeDataExpedient("Observaciones")}
                    margin="normal" multiline rows="4"
                    variant="outlined" />
                </Grid>

                <Grid item xs={12} className="p-4">
                  {this.renderUbicationTable()}
                </Grid>
              </Grid>
            </ValidatorForm>
          </Grid>
        </Paper>

        {this.renderExpedientType()}
      </div>
    )
  }
}

FichaExpediente.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  expediente: state.expedientes.ExpedientNew ? state.expedientes.ExpedientNew : {},
  sourceExpediente: state.expedientes.ExpedientNew && state.expedientes.ExpedientNew.Expediente.length > 0 ? state.expedientes.ExpedientNew.Expediente[0] : {},
  funcionesTipologicas: state.trabajos.funcionesTipologia.data ? state.trabajos.funcionesTipologia.data.Tipos_Trabajos_Funciones : [],
  state: state
})

const mapDispatchToProps = {
  editExpedienteEnTrabajo: dispatchEditExpedienteEnTrabajo
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(FichaExpediente)));