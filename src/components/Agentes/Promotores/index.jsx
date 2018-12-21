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
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  fetchBuscador, dispatchLimpiarBusquedaPromotores, dispatchAddPromotor,
  dispatchDeletePromotor, dispatchEditPromotor
} from '../../../actions/expedientes/index';

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

class Promotores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canSearch: false,
      selectedOption: "Nombre",
      searchQuery: "",
      isSearch: false
    }
  }

  componentDidMount() {
    try {
      if (this.props.selectedPromoters.length === 0)
        this.addPromotor({
          "Id_Entidad": 703436,
          "Nif": "B12345688",
          "Nombre": "Construcciones Florentino Gomez",
          "Apellido1": null,
          "Apellido2": null,
          "Tipo_Organismo": "Sociedades limitadas ",
          "Calle": "General Aranda",
          "Numero": "6",
          "Piso": "",
          "Codigo_postal": "36206",
          "Concello": "CAMBADOS"
        });
    }
    catch (e) {
      console.log("ERROR", e)
    }
  }

  handleCanSearch = (cansearch, resetSearch = false) => {
    this.setState({ canSearch: cansearch })
    if (resetSearch) {
      this.props.cleanSearch();
      this.setState({ searchQuery: "" })
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

  async handleSearch() {
    if (this.state.searchQuery !== "") {
      this.setState({ isSearch: true })
      await this.props.fetchBuscador(this.state.searchQuery, "promotores");
      this.setState({ isSearch: false })
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  addPromotor(promotor) {
    if (promotor)
      this.props.addPromotor(promotor);
  }

  editPromotor(nif) {
    let promotor = this.props.promotores.find(x => x.Nif === nif);
  }

  deletePromotor(nif) {
    this.props.deletePromotor(nif);
  }

  renderSelection = () => {
    let { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Grid container >
          <Grid item md={10} className={classes.subtitle}>Promotores</Grid>
          <Grid item md={2}>
            <Fab size="small" color="primary" aria-label="Add"
              className={classes.fab} onClick={() => { this.handleCanSearch(true, true) }}>
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.headHeight}>
              <CustomTableHead className="text-uppercase px-3">NIF</CustomTableHead>
              <CustomTableHead className="text-uppercase">
                <Translate id="languages.agentes.tableColumnName" />
              </CustomTableHead>
              <CustomTableHead className="pl-3 text-uppercase">%</CustomTableHead>
              <CustomTableHead></CustomTableHead>
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBodyHeight}>
            {
              this.props.selectedPromoters.length === 0 ?
                <TableRow>
                  <TableCell colSpan={5}></TableCell>
                </TableRow>
                : this.props.selectedPromoters.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell component="th" scope="row" className="px-1 text-center">
                        {row.Nif}
                      </TableCell>
                      <TableCell className="p-0 text-center">{row.Nombre}</TableCell>
                      <TableCell className="p-3 text-center">{row.Porciento ? `${row.Porciento}%` : ""}</TableCell>
                      <TableCell className="p-0 button-column-static">
                        <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary">
                          <EditIcon />
                        </IconButton >
                        <IconButton className={classes.buttonEdit} color="primary" aria-label="Delete"
                          onClick={() => this.deletePromotor(row.Nif)}>
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
            {['CIF/NIF', 'Nombre'].map((option, index) => (
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

          <Grid item xs={12} className="text-left">
            {this.renderSearchResults()}
          </Grid>
        </Paper>
        : <div></div>
    );
  }

  renderSearchResults = () => {
    let { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Grid item xs={12} className={`${classes.subtitle} text-left fa-bold px-3`}>
          Resultados
        </Grid>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.headHeight}>
              <CustomTableHead className="text-uppercase px-3">CIF/NIF</CustomTableHead>
              <CustomTableHead className="text-uppercase">
                <Translate id="languages.agentes.tableColumnName" />
              </CustomTableHead>
              <CustomTableHead></CustomTableHead>
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBodyHeight}>
            {
              this.props.searchResult.length === 0 ?
                <TableRow>
                  <TableCell colSpan={3} className="text-center">0 Resultados</TableCell>
                </TableRow>
                : this.props.searchResult.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell component="th" scope="row" className="px-3">
                        {row.Nif}
                      </TableCell>
                      <TableCell>{row.Nombre}</TableCell>
                      <TableCell className="px-2 py-0 button-column-short">
                        <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary">
                          <CheckIcon />
                        </IconButton >
                      </TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
      </Paper>
    )
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
  searchResult: state.expedientes.resultadoBusquedaPromotores,
  selectedPromoters: state.expedientes.promotores,
})

const mapDispatchToProps = {
  fetchBuscador: fetchBuscador,
  cleanSearch: dispatchLimpiarBusquedaPromotores,
  addPromotor: dispatchAddPromotor,
  editPromotor: dispatchEditPromotor,
  deletePromotor: dispatchDeletePromotor
};

Promotores.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(Promotores)));