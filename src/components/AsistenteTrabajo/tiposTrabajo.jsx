import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { CircularProgress } from '@material-ui/core';
import { Grid, Typography, TextField, Button } from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';
import { getFasesTrabajos } from '../../api/index';
import { dispatchError, fetchErrorTrabajo } from '../../actions/trabajos';
import EnhancedTable from './tablaTiposTrabjo';


const styles = theme => ({
  titleMainPanel: {
    borderBottom: `2px solid ${grey[100]}`
  },
  withoutRadius: {
    borderRadius: "0 !important"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%",
    textAlign: 'left',
    marginTop: 5
  },
});

class TiposTrabajo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      encomenda: this.props.encomenda,
      dataEncomenda: this.props.encomenda && this.props.encomenda.EncomendaActual
        && this.props.encomenda.EncomendaActual.length > 0
        ? this.props.encomenda.EncomendaActual[0] : null,
      trabajos: [],
      gruposTrabajos: [[], []],
      language: this.props.activeLanguage.code,
      selectTrabajos: [],
      linealWorksSelection: this.props.previusSelection ? this.props.previusSelection : [],
      isLoading: true
    }
  }

  async componentDidMount() {
    await this.loadFasesTrabajos();
    this.loadPreviusSelection();
  }

  /**Carga la preseleccion de los elementos */
  loadPreviusSelection() {
    if (this.props.previusSelection && this.props.previusSelection.length > 0) {
      let trabajosSeleccion = [];
      Object.assign(trabajosSeleccion, this.state.selectTrabajos);

      for (let i = 0; i < this.props.previusSelection.length; i++) {
        let work = this.props.previusSelection[i];
        let groupIndex = trabajosSeleccion.findIndex(x => x.fase === work.Id_Tipo_Fase);
        if (groupIndex !== -1)
          trabajosSeleccion[groupIndex].trabajos.push(work);
        else {
          trabajosSeleccion.push({ fase: work.Id_Tipo_Fase, trabajos: [work] })
        }
      }
      this.setState({ selectTrabajos: trabajosSeleccion });
    }
  }

  async loadFasesTrabajos() {
    try {
      let fases = await getFasesTrabajos(this.state.dataEncomenda.Id_Tipo_Grupo_Tematico,
        this.state.dataEncomenda.Id_Tipo_Autorizacion_Municipal, this.state.language);
      if (fases.MensajesProcesado && fases.MensajesProcesado.length > 0)
        this.props.fetchErrorTrabajo(fases);
      if (fases.data.MensajesProcesado && fases.data.MensajesProcesado.length > 0)
        this.props.fetchErrorTrabajo(fases.data);
      if (fases.data && fases.data.FasesTrabajos) {
        let result = [];
        let groupResult = [[], []];
        for (let i = 0; i < fases.data.FasesTrabajos.length; i++) {
          let trabajo = fases.data.FasesTrabajos[i];
          if (result.some(x => x.Id_Tipo_Fase === trabajo.Id_Tipo_Fase)) {
            let index = result.findIndex(x => x.Id_Tipo_Fase === trabajo.Id_Tipo_Fase);
            result[index].trabajos.push(trabajo);
          }
          else {
            result.push({
              fase: trabajo.Fase,
              Id_Tipo_Fase: trabajo.Id_Tipo_Fase,
              trabajos: [trabajo]
            })
          }
        }

        result.forEach(element => {
          if (groupResult[0].length === 0)
            groupResult[0].push(element);
          else if (groupResult[1].length === 0)
            groupResult[1].push(element);
          else {
            if (this.countItems(groupResult[0]) <= this.countItems(groupResult[1])) {
              groupResult[0].push(element);
            }
            else {
              groupResult[1].push(element);
            }
          }
        })
        this.setState({ trabajos: result, gruposTrabajos: groupResult, isLoading: false });
      }
    }
    catch (error) {
      this.setState({ isLoading: false });
    }
  }

  countItems = (relations) => {
    return relations.reduce((prev, item) => prev + item.trabajos.length, 0);
  }

  async updateSelectTrabajos(trabajos) {
    let newState = [];
    Object.assign(newState, this.state.selectTrabajos);
    if (newState.some(x => x.fase === trabajos.fase)) {
      newState = newState.filter(x => x.fase !== trabajos.fase);
    }
    newState.push(trabajos);

    //Actualizar los trabajos para el componente de crear trabajo
    let works = [];
    newState.map((value) => {
      if (value.trabajos.length > 0) {
        works = works.concat(value.trabajos);
      }

    })

    await this.setState(state => ({ ...state, selectTrabajos: newState, linealWorksSelection: works }));
    await this.props.updateTrabajoSeleccion(works);
  }

  handleNext() {
    if (this.state.linealWorksSelection.length === 0) {
      this.props.dispatchError(<Translate id="languages.messages.trabajosSelectionValidate" />)
    }
    else {
      this.props.handleNavigation(false);
    }
  }

  getSelections(dataSource) {
    let worksSelecteds = dataSource.filter(f =>
      this.state.linealWorksSelection.some(x => x.Id_Tipo_Trabajo === f.Id_Tipo_Trabajo))
      .map(x => { return x.Id_Tipo_Trabajo; });
    return worksSelecteds;
  }

  render() {
    let { classes } = this.props;
    return (
      this.state.isLoading ?
        <Grid item xs={12} className="text-center"><CircularProgress /></Grid>
        : !this.state.dataEncomenda ? <Grid></Grid>
          : <Grid container spacing={8} >
            <Grid item xs={6}>
              <TextField disabled={true}
                value={this.state.dataEncomenda.Descripcion_Encomenda ? this.state.dataEncomenda.Descripcion_Encomenda : ""}
                label={<Translate id="languages.crearTrabajo.labelExpedienteType" />}
                className={`${classes.textField} my-3 text-uppercase mx-0 pl-0 pr-1`} />
            </Grid>

            <Grid item xs={12} className="py-2">
              <Typography variant="subtitle2" gutterBottom className="mb-0">
                <Translate id="languages.crearTrabajo.selectionTitle" />
              </Typography>
              <Grid container spacing={16}>
                <Grid item xs={6} className="pt-0">
                  {this.state.gruposTrabajos[0].map((value, index) => {
                    let selection = this.getSelections(value.trabajos);

                    return <Grid item xs={12} key={`${index}_0`} >
                      <EnhancedTable data={value} className="my-2" key={`${index}_0table`}
                        updateSelectTrabajos={(trabajos) => this.updateSelectTrabajos(trabajos)}
                        previusSelection={selection} />
                    </Grid>
                  })}
                </Grid>

                <Grid item xs={6} className="pt-0">
                  {this.state.gruposTrabajos[1].map((value, index) => {

                    let dataSelection = this.getSelections(value.trabajos);
                    return <Grid item xs={12} key={`${index}_1`}>
                      <EnhancedTable data={value} className="my-2" key={`${index}_1table`}
                        updateSelectTrabajos={(trabajos) => this.updateSelectTrabajos(trabajos)}
                        previusSelection={dataSelection} />
                    </Grid>
                  })}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" className="float-right py-1"
                onClick={() => this.handleNext()}>
                <Translate id="languages.generalButton.next" /><NavigateNext className={classes.rightIcon} />
              </Button>
            </Grid>
          </Grid>
    )
  }

}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  dispatchError: dispatchError,
  fetchErrorTrabajo: fetchErrorTrabajo
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(TiposTrabajo)));