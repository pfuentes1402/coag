import React, { Component } from 'react';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import {
  withStyles, Grid, Paper, Typography, Divider,
  TextField, Button
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { grey } from '@material-ui/core/colors';
import moment from 'moment';
import { Table, TableCell, TableHead, TableBody, TableRow, Fab, IconButton, CircularProgress } from '@material-ui/core';
import { Add, Edit, Check, Close } from '@material-ui/icons';
import { dispatchEditExpedienteEnTrabajo, fetchErrorExpediente, formatMenssage } from '../../../../actions/expedientes';
import { putExpediente, putEmplazamiento } from '../../../../api';
import ValidateAddress from '../../../Address';
import { elimardelatabla, saveAdressTostore } from "../../../../actions/expedientes";
import { some, findIndex } from 'lodash';
import classNames from 'classnames';

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
  },
  tableWrapper: {
    overflowX: 'auto',
  },
    disable: {
      pointerEvents: "none",
        opacity: 0.6
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
      sourceExpediente: this.props.sourceExpediente,
      emplazamientos: this.props.expediente.Emplazamientos,
      location: {},
      isUpdate: false,
      isAddUbicacion: false,
      isShowAddress: false,
      isLoadingSave: false,
    }
  }

  handleChangeDataExpedient = (propertyName) => (event) => {
    let expedienteCopy = {};
    Object.assign(expedienteCopy, this.state.sourceExpediente);
    expedienteCopy[propertyName] = event.target.value;
    this.setState({ sourceExpediente: expedienteCopy });
  }

  async handleSubmit() {
    this.setState({ isUpdate: true });
    let result = await putExpediente(this.state.sourceExpediente)
    if (result.data && result.data.MensajesProcesado && result.data.MensajesProcesado.length > 0) {
      this.props.fetchErrorExpediente(result.data);
    }
    this.setState({ isUpdate: false });
  }

  handleShowUbication(action) {
    this.setState({ isAddUbicacion: action, isShowAddress: false });
  }

  handleUpdateLocation(location) {
    this.setState({ location: location });
  }

  handleUpdateIsShowAddress(showAddress) {
    this.setState({ isShowAddress: showAddress });
  }

  async handleSaveAddress() {
    let { location, emplazamientos } = this.state;
    await this.setState({ isLoadingSave: true });
    let locations = [];
    Object.assign(locations, emplazamientos);
    let equal = this.ifEqual(emplazamientos, location);
    if (equal === -1) {
      locations.push(location);
    }
    else {
      locations[equal] = location;
    }

    let response = await putEmplazamiento(this.state.sourceExpediente.Id_Expediente, { "Emplazamientos": locations, "ignorarobservaciones": 1 });
    if (response.data && response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0) {
      this.props.fetchErrorExpediente(response.data);
      this.setState({ isLoadingSave: false });

    }
    else if (response.response) {
      if (response.response.data.MensajesProcesado) {
        this.props.fetchErrorExpediente(response.response.data);
        this.setState({ isLoadingSave: false });
      }
      else {
        this.props.fetchErrorExpediente(formatMenssage(response.response.data.Message));
        this.setState({ isLoadingSave: false })
      }
    }
    else {
      this.setState({ emplazamientos: locations, isShowAddress: false, isLoadingSave: false })
      this.handleShowUbication(false);
    }

  }

  ifEqual(data, address) {
    let equal = some(data, address);
    let index = -1;
    if (equal) {
      index = findIndex(data, address);
    }
    return index;
  }

  handleEdit(location) {
    this.setState({ isShowAddress: true, isAddUbicacion: true, location: location })
  }

  renderUbicationTable() {
    let { classes } = this.props;
    return (
      <div className="p-2">
        <Grid container >
          <Grid item xs={10}>
            <Typography variant="subtitle1" gutterBottom className="m-2">
              <Translate id="languages.fichaExpediente.titleUbication" />
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Fab size="small" color="primary" aria-label="Add"
              onClick={() => this.handleShowUbication(true)}
              className={classes.fab}>
              <Add />
            </Fab>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.tableWrapper}>
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
                    this.state.emplazamientos.length === 0 ?
                      <TableRow>
                        <TableCell colSpan={6}></TableCell>
                      </TableRow>
                      : this.state.emplazamientos.map((row, index) => {
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
                              <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary" onClick={() => { this.handleEdit(row) }}>
                                <Edit />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  }
                </TableBody>
              </Table>
            </div>
          </Grid>
        </Grid>
        {
          this.state.isAddUbicacion &&
          <Grid item xs={12} className="pt-2">
            <ValidateAddress updateLocation={(location) => { this.handleUpdateLocation(location) }} isShowAddress={this.state.isShowAddress} updateIsShowAddress={(showAddress) => { this.handleUpdateIsShowAddress(showAddress) }} location={this.state.location} />
            <Grid item xs={12} className="text-right">
              <Button color="primary" size="small" className={`${classes.button} mx-2`}
                onClick={() => { this.handleShowUbication(false) }}>
                <Translate id="languages.generalButton.cancel" /><Close className={classes.rightIcon} />
              </Button>
              <Button variant="contained" size="small" color="primary" className={classes.button} disabled={this.state.isLoadingSave}
                onClick={() => { this.handleSaveAddress() }}>
                <Translate id="languages.generalButton.added" />
                {this.state.isLoadingSave && <CircularProgress size={24} />}
              </Button>
            </Grid>
          </Grid>
        }
      </div>
    );
  }

  render() {
    let { classes } = this.props;
    return (
      <div>
        <Paper className={`${classes.withoutRadius} m-3`}>
          <ValidatorForm ref="form" onSubmit={async () => { await this.handleSubmit() }}>
            <Grid container spacing={16} className={classNames("my-3", this.props.disable ? classes.disable : "")} >
              <Grid item xs={12}>
                <Grid item xs={12} className="d-flex justify-content-between">
                  <Typography variant="subtitle1" gutterBottom className="mx-2 my-1">
                    <Translate id="languages.fichaExpediente.titleFichaExpediente" />
                  </Typography>
                  <Button type="submit" color="primary" disabled={this.state.isUpdate} >
                    Aplicar cambios <Check />
                  </Button>
                </Grid>
                <Divider style={{ height: 3 }} />
              </Grid>
              <Grid item xs={12}>

                <Grid container spacing={16}>
                  <Grid item xs={12} className="ml-3 mr-3">
                    <Grid container spacing={24}>
                      <Grid item xs={7} >
                        <TextValidator
                          value={this.state.sourceExpediente.Titulo}
                          label={<Translate id="languages.fichaExpediente.labelExpedienteName" />}
                          className={classes.textField}
                          validators={['required']}
                          errorMessages={[this.props.translate("languages.fichaExpediente.requiredField")]}
                          onChange={this.handleChangeDataExpedient("Titulo")}
                          name="name" />
                        <TextValidator
                          value={this.state.sourceExpediente.Expediente_Codigo_Estudio}
                          label={<Translate id="languages.fichaExpediente.labelExpedienteCode" />}
                          className={`${classes.textField} mt-3`}
                          validators={['required']}
                          errorMessages={[this.props.translate("languages.fichaExpediente.requiredField")]}
                          onChange={this.handleChangeDataExpedient("Expediente_Codigo_Estudio")}
                          name="code" />
                        <TextField
                          value={this.state.sourceExpediente.Antecedente}
                          label={<Translate id="languages.fichaExpediente.labelExpedienteAnteced" />}
                          className={`${classes.textField} mt-3`}
                          placeholder=""
                          InputLabelProps={{shrink: true}}
                          onChange={this.handleChangeDataExpedient("Antecedente")}
                          name="antecedente" />
                      </Grid>
                      <Grid item xs={5} >
                        <Typography variant="subtitle1" gutterBottom className="m-0"
                          style={{ color: "rgba(0, 0, 0, 0.55)" ,fontSize:"0.8rem"}}>
                          <Translate id="languages.fichaExpediente.labelEntryDate" />
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          {moment(new Date(this.state.sourceExpediente.Fecha_Entrada)).format("DD/MM/YYYY")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={`${classes.divGrey} p-4`}>
                    <Typography variant="subtitle1" gutterBottom className="m-0"
                      style={{ color: "rgba(0, 0, 0, 0.55)", fontSize:"0.8rem" }}>
                      <Translate id="languages.fichaExpediente.labelObservations" />
                    </Typography>
                    <TextField id="outlined-bare"
                      className={`${classes.textField} m-0`}
                      defaultValue={this.state.sourceExpediente.Observaciones}
                      onChange={this.handleChangeDataExpedient("Observaciones")}
                      margin="normal" multiline rows="4"
                      variant="outlined" />
                  </Grid>
                  <Grid item xs={12} className="p-4">
                    {this.renderUbicationTable()}
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
          </ValidatorForm>
        </Paper>
      </div>
    )
  }
}

FichaExpediente.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  funcionesTipologicas: state.trabajos.funcionesTipologia.data ? state.trabajos.funcionesTipologia.data.Tipos_Trabajos_Tunciones : [],
  catastro: state.expedientes.addressreducida ? state.expedientes.addressreducida : [], /*Contiene arreglo de la tabla de ubicaciones */
  arrayReferencias: state.expedientes.arrayReferencias ? state.expedientes.arrayReferencias : [] /*Contiene arreglo con las referencial catastrales de cada direccion de la tabla ubicacion*/,
  addressData: state.expedientes.address ? state.expedientes.address : ''
})

const mapDispatchToProps = {
  editExpedienteEnTrabajo: dispatchEditExpedienteEnTrabajo,
  fetchErrorExpediente,
  saveAdressTostore: saveAdressTostore,
  elimardelatabla: elimardelatabla,
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(FichaExpediente)));