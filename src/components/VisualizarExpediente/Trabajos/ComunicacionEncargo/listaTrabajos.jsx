import React, { Component } from 'react';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { withStyles, Grid, Button, Divider } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Table, TableCell, TableHead, TableBody, TableRow, Paper, Fab, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

const styles = theme => ({
  subtitle: {
    padding: "10px 20px"
  },
  fab: {
    margin: theme.spacing.unit,
    marginTop: 25,
    position: 'absolute',
    marginLeft: 40
  },
  table: {
    minWidth: 200,
  },
  tableBodyHeight: {
    minHeight: 100
  },
  headHeight: {
    height: 40
  },
  withoutRadius: {
    borderRadius: 0
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

class ListaTrabajos extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    let { classes } = this.props;
    return (
      <Paper className={`${classes.withoutRadius} m-3`}>
        <Grid container >
          <Grid item md={10}>
            <Typography variant="subtitle1" gutterBottom className="m-2">
              <Translate id="languages.fichaExpediente.titleListaTrabajos" />
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Fab size="small" color="primary" aria-label="Add"
              className={classes.fab}>
              <Add />
            </Fab>
          </Grid>
          <Grid item md={12}>
            <Divider style={{ height: 3 }} />
          </Grid>
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.headHeight}>
              <CustomTableHead className="text-uppercase px-3">N</CustomTableHead>
              <CustomTableHead className="text-uppercase">Título del trabajo</CustomTableHead>
              <CustomTableHead className="pl-3 text-uppercase">Estado</CustomTableHead>
              <CustomTableHead className="text-uppercase px-3">Entrada</CustomTableHead>
              <CustomTableHead className="text-uppercase px-3">Visado</CustomTableHead>
              <CustomTableHead className="text-uppercase px-3">Inc</CustomTableHead>
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBodyHeight}>
            {
              this.props.expediente.Trabajos.length === 0 ?
                <TableRow>
                  <TableCell colSpan={6}></TableCell>
                </TableRow>
                : this.props.expediente.Trabajos.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell component="th" scope="row" className="px-1 text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell className="p-0"><a href="!#">{row.Titulo}</a></TableCell>
                      <TableCell className="p-3">{row.Estado}</TableCell>
                      <TableCell className="p-0">{}</TableCell>
                      <TableCell className="p-0"></TableCell>
                      <TableCell className="p-0"></TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  expediente: state.expedientes.ExpedientNew ? state.expedientes.ExpedientNew : {},
  state: state
})

const mapDispatchToProps = {
};

ListaTrabajos.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(ListaTrabajos)));