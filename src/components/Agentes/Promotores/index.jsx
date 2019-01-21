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
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Grid } from '@material-ui/core';
import Input from '@material-ui/core/Input';
import {
    fetchErrorExpediente,
} from '../../../actions/expedientes';
import { Tabs, Tab } from '@material-ui/core';
import Organismo from './addOrganismo';
import Person from './addPerson';
import SearchAgente from '../search';

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
  },
  paddingButtom:{
    padding: "5px 6px 6px 6px"
  },
    percentage: {
      border: "none"
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
        showAddPromotor: false,
        showSearchResult: false,
        selectedOption: "Nombre",
        searchQuery: "",
        isSearch: false,
        editPromotorData: {
          "Id_Entidad": -1,
          "Nif": "",
          "Id_Tipo_Entidad": 1,
          "Nombre": "",
          "Apellido1": "",
          "Apellido2": "",
          "Observaciones": "",
          "Id_Tipo_Organismo": "",
          "Mail": "",
          "Telefono": "",
          "Calle": "",
          "Numero": "",
          "Piso": "",
          "Codigo_Postal": "",
          "Porcentaje": null,
          "PorcentajesEquitativos": 1,
          "Id_Concello": "",
          "Id_Provincia": "",
          "Id_Autonomia": 71,
          "Id_Pais": 100,
        },
        value: 0,
        currentPage: 0,
        rowsPerPage: 25,
        totalRecords: 100,
        totalPages: 4,
        selectedPromoters: this.props.encomenda ? this.props.encomenda : [],
        percentage: "",
        percentageEdit: false,
    }
  }

  handleChange = (event, value) => {
    let promotor = {};
    Object.assign(promotor, this.state.editPromotorData);
    promotor["Id_Tipo_Entidad"] = value === 0 ? 1 : 2;
    this.setState({ editPromotorData: promotor, value: value })
  };

  handleCanSearch = () => {
    this.setState({ canSearch: true, showAddPromotor: false });
  }


  handleCancel(){
      this.setState({showAddPromotor: false});
    }

  addPromotor(promotor) {
      let objectPromotores = {};
      Object.assign(objectPromotores, this.state.selectedPromoters);
      let arrayPromotores = objectPromotores.Promotores;
        if (promotor) {
            let index = arrayPromotores.findIndex(x => x.Nif === promotor.Nif);
            if (index === -1) {
                arrayPromotores.push(promotor);
            }
            else {
                arrayPromotores[index]= promotor;
            }
            objectPromotores.Promotores = arrayPromotores
            this.setState({ showAddPromotor: false, selectedPromoters: objectPromotores});
            this.props.updateEncomenda(objectPromotores);
        }
  }

  editPromotor() {
      this.setState({percentageEdit: true})
  }

  handleChangePercentage = nif => event =>{
      let arrayPromotores = [];
      Object.assign(arrayPromotores, this.state.selectedPromoters);
      let index = arrayPromotores.Promotores.findIndex(x => x.Nif === nif);
      if (index !== -1) {
          arrayPromotores.Promotores[index].Porcentaje = event.target.value;
          this.setState({ selectedPromoters: arrayPromotores});
          this.props.updateEncomenda(arrayPromotores);
      }

  }

  deletePromotor(nif) {
      let objectPromotores = {};
      Object.assign(objectPromotores, this.state.selectedPromoters);
      let arrayPromotores = objectPromotores.Promotores;
      let index = arrayPromotores.findIndex(x => x.Nif === nif);
      if(index !== -1){
          arrayPromotores.splice(index,1);
          objectPromotores.Promotores = arrayPromotores
          this.setState({ selectedPromoters: objectPromotores});
          this.props.updateEncomenda(objectPromotores);
      }

  }

    handleSelectAgent(agent){
      this.setState({editPromotorData: agent, showAddPromotor: true, value: agent.Id_Tipo_Entidad - 1});
    }

  renderSelection = () => {
    let { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Grid container >
          <Grid item md={10} className={classes.subtitle}>Promotores</Grid>
          <Grid item md={2}>
            <Fab size="small" color="primary" aria-label="Add"
              className={classes.fab} onClick={() => { this.handleCanSearch() }}>
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
              <CustomTableHead className="p-1 text-uppercase">%</CustomTableHead>
              <CustomTableHead/>
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBodyHeight}>
            {
              this.state.selectedPromoters.Promotores.length === 0 ?
                <TableRow>
                  <TableCell colSpan={5}></TableCell>
                </TableRow>
                : this.state.selectedPromoters.Promotores.map((row, index) => {
                  return (
                    <TableRow className={classes.row} key={index}>
                      <TableCell padding="none" className="px-1 text-center">
                        {row.Nif}
                      </TableCell>
                      <TableCell padding="none" className="p-0">{row.Nombre + (row.Apellido1 ? row.Apellido1 : "") + (row.Apellido2 ? row.Apellido2 : "")}</TableCell>
                      <TableCell padding="none">
                          <Input
                              id="percentage" style={{width: 45, margin: 0}}
                              value={row.Porcentaje ? row.Porcentaje : ""}
                              onChange={this.handleChangePercentage(row.Nif)}
                              disabled={!this.state.percentageEdit}
                              type="Number"
                              disableUnderline
                          />
                          </TableCell>
                      <TableCell className="p-0 button-column-static">
                        <IconButton className={classes.buttonEdit} aria-label="Edit" color="primary"
                          onClick={() => {this.editPromotor(row.Nif,true)}}>
                          <EditIcon/>
                        </IconButton >
                        <IconButton className={classes.buttonEdit} color="primary" aria-label="Delete"
                          onClick={() => {this.deletePromotor(row.Nif)}}>
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

  renderTabsPromotor = () => {
    return <Paper>
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
        indicatorColor="primary"
        textColor="primary"
        scrollable
        scrollButtons="auto">
        <Tab label={<Translate id="languages.agentes.titlePersona" />} />
        <Tab label={<Translate id="languages.agentes.titleOrganismo" />} />
      </Tabs>
      {this.state.value === 0 && <Person key={this.state.editPromotorData.Nif} promotor={this.state.value + 1 === this.state.editPromotorData.Id_Tipo_Entidad ? this.state.editPromotorData : null} onCancelPromotor={()=>{this.handleCancel()}} onAddPerson={(person) => { this.addPromotor(person) }} />}
      {this.state.value === 1 && <Organismo key={this.state.editPromotorData.Nif} promotor={this.state.value + 1 === this.state.editPromotorData.Id_Tipo_Entidad ? this.state.editPromotorData : null} onCancelPromotor={()=>{this.handleCancel()}} onAddOrganismo={(organismo) => { this.addPromotor(organismo) }} />}
    </Paper>
  }

  render() {
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          {this.renderSelection()}
        </Grid>

        <Grid item xs={12}>
            {this.state.canSearch ? <SearchAgente tipoBusqueda="Promotores" selectAgent={(agent)=>{this.handleSelectAgent(agent)}} allowAdd={true}/> : ""}
        </Grid>

        <Grid item xs={12} >
          {this.state.showAddPromotor ? this.renderTabsPromotor() : ""}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    fetchErrorExpediente: fetchErrorExpediente
};

Promotores.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(Promotores)));