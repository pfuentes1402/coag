import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Typography, Grid, Paper, TextField, Button } from '@material-ui/core';
import { Table, TableCell, TableHead, TableBody, TableRow, Divider } from '@material-ui/core';
import {  Check } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { fetchErrorExpediente } from '../../../../actions/expedientes';
import { withRouter } from 'react-router-dom';

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
    tableArquitecto: {
        minWidth: 190,
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
      expediente: this.props.expediente
    }
  }

  componentWillMount() {

  }

  renderAgentsTable() {
    let { classes } = this.props;
    return (
      <div className="p-3">
        <Grid container className={`${classes.headerBorder}`}>
          <Grid item md={12}>
            <Typography variant="subtitle1" gutterBottom className="m-2">
              <Translate id="languages.fichaExpediente.titleAgents" />
            </Typography>
          </Grid>
        </Grid>
          <div className={classes.tableWrapper}>
            <Table className={`${classes.tableArquitecto} ${classes.tableBorder}`}>
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
                      <TableCell className="px-1" style={{ width: 100 }}></TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
          </div>
      </div>
    );
  }

  renderPromotorsTable() {
    let { classes } = this.props;
    return (
      <div className="p-3">
        <Grid container className={classes.headerBorder}>
          <Grid item md={10}>
            <Typography variant="subtitle1" gutterBottom className="m-2">
              <Translate id="languages.fichaExpediente.titlePromotors" />
            </Typography>
          </Grid>
        </Grid>
          <div className={classes.tableWrapper}>
            <Table className={`${classes.table} ${classes.tableBorder}`}>
          <TableHead>
            <TableRow className={classes.headHeight}>
              <CustomTableHead className="text-uppercase px-3">Nif</CustomTableHead>
              <CustomTableHead className="text-uppercase">
                <Translate id="languages.fichaExpediente.tableColumnName" />
              </CustomTableHead>
              <CustomTableHead className="pl-3 text-uppercase">%</CustomTableHead>
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
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
          </div>
      </div>
    );
  }

  render() {
    let { classes } = this.props;
    return (
      <Paper className={`${classes.withoutRadius} m-3`}>
        <Grid container spacing={16} className="my-3 p-2">
          <Grid item xs={12} className="p-0">
            <Grid item xs={12} className=" d-flex justify-content-between">
              <Typography variant="subtitle1" gutterBottom className="mx-2 my-1">
                <Translate id="languages.fichaExpediente.titleExpedientType" />
              </Typography>
              <Button color="primary" onClick={() => this.props.history.push(`/comunicacion/${this.state.sourceExpediente.Id_Expediente}`)}>
                <Translate id="languages.fichaExpediente.editExpOptionTitle" /><Check />
              </Button>
            </Grid>
            <Divider style={{ height: 3 }} />
          </Grid>

          <Grid container spacing={24}>
            <Grid item xs={12} className="p-4">
              <TextField
                value={this.state.sourceExpediente.Descripcion_Encomenda_Actual}
                label={<Translate id="languages.fichaExpediente.titleExpedientType" />}
                className={`${classes.textField} mt-3 text-uppercase`}
                disabled={true}
                name="expedientType" />
            </Grid>

            <Grid item xs={12}>
              {this.renderPromotorsTable()}
            </Grid>

            <Grid item xs={12} >
              {this.renderAgentsTable()}
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
  fetchErrorExpediente
};

TipoExpediente.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(TipoExpediente))));