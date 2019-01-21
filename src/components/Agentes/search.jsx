import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Grid, Paper, Button, CircularProgress } from '@material-ui/core';
import { Table, TableCell, TableHead, TableBody, TableRow, Fab, IconButton, Divider } from '@material-ui/core';
import { Check, Close, Search } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import TablePagination from '@material-ui/core/TablePagination';
import { getBuscador } from '../../api';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
    textAlign: 'left',
    marginTop: 5
  },
  button: {
    margin: theme.spacing.unit,
  },
  headHeight: {
    height: 40
  },
  buttonEdit: {
    border: "1.2px solid",
    margin: 2,
    padding: 6,
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
  },
}))(TableCell);

class SearchAgents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      isSearch: false,
      selectAgent: null,

      showSearchResult: false,
      searchResult: [],
      currentPage: 0,
      rowsPerPage: 10,
      totalRecords: 100,
      totalPages: 4
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

  handleSearchQueryChange = event => {
    this.setState({
      searchQuery: event.target.value
    });
  }

  async handleSearch() {
    this.setState({ isSearch: true });
    let search = await getBuscador(this.state.searchQuery, this.props.tipoBusqueda, (this.state.currentPage + 1), this.state.rowsPerPage);

    if (search && search.data && search.data[this.props.tipoBusqueda]) {
      let pagination = search.data.Paginacion && search.data.Paginacion.length > 0
        ? search.data.Paginacion[0] : {};
      this.setState({
        showSearchResult: true,
        isSearch: false,
        searchResult: search.data[this.props.tipoBusqueda],
        totalRecords: pagination.Numero_Total_Registros,
        totalPages: pagination.Numero_Paginas
      });
    }
    else
      this.setState({ showSearchResult: true, isSearch: false });
  }

  selectAgent = (agent) => {
    //this.setState({ selectAgent: agent });
    this.props.selectAgent(agent);
  }

  renderSearchResults() {
    let { classes } = this.props;
    return (
      this.state.showSearchResult &&
      <Grid item>
        <Divider style={{ height: 2 }} />
        <Grid item xs={12} className={`${classes.subtitle} text-left fa-bold px-3 py-2`}>
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
              this.state.searchResult.length === 0 ?
                <TableRow>
                  <TableCell colSpan={3} className="text-center">0 Resultados</TableCell>
                </TableRow>
                : this.state.searchResult.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell component="th" scope="row" className="px-3">
                        {row.Nif}
                      </TableCell>
                      <TableCell>{`${row.Nombre} ${row.Apellido1} ${row.Apellido2}`}</TableCell>
                      <TableCell className="px-2 py-0 button-column-short">
                        <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary"
                          onClick={() => this.selectAgent(row)}>
                          <Check />
                        </IconButton >
                      </TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>

        <TablePagination labelRowsPerPage={<Translate id="languages.promotores.itemsPerPage" />}
          rowsPerPageOptions={[10, 25]}
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
          onChangeRowsPerPage={this.handleChangeRowsPerPage} />
      </Grid>
    )
  }

  renderSearchBox = () => {
    let { classes } = this.props;
    return (
      <Paper className={`${classes.withoutRadius} text-center`}>
        <ValidatorForm ref="form" onSubmit={() => { this.handleSearch() }}>
          <TextValidator
            value={this.state.searchQuery}
            onChange={this.handleSearchQueryChange}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                this.handleSearch();
              }
            }}
            label={<Translate id="languages.agentes.searchLabelBox" />}
            className={classes.textField}
            validators={['required']}
            errorMessages={['el criterio de búsqueda es obligatorio']}
            name="searchQuery">
          </TextValidator>

          <Grid item xs={12} className="py-3">
            <div style={{ display: "inline-flex", alignItems: "center" }}>
              <Button color="primary" size="small" className="py-0"
                onClick={() => this.props.handleAddAgent(false)}>
                <Translate id="languages.generalButton.cancel" /><Close />
              </Button>
              <Button variant="contained" size="small" color="primary" className="py-0"
                type="submit">
                <Translate id="languages.agentes.search" /><Search />
              </Button>
              {this.state.isSearch ? <CircularProgress size={24} /> : ""}
            </div>
          </Grid>

          <Grid item xs={12} className="text-left">
            {this.renderSearchResults()}
          </Grid>
        </ValidatorForm>
      </Paper>
    );
  }

  render() {
    return (
      <Grid container spacing={8} className="py-2">
        <Grid item xs={12}>
          {this.renderSearchBox()}
        </Grid>
      </Grid>
    )
  }
}

SearchAgents.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withLocalize(withStyles(styles)(SearchAgents));