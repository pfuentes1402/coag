import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    fetchFasesTrabajos, fetchTipoAutorizacion, fetchTipoTrabajo, fetchGruposRaiz,
    fetchComunicacionencargo, dispatchError
} from "../../actions/trabajos";
import { connect } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { Container } from "reactstrap";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Next from '@material-ui/icons/NavigateNext';
import Close from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { grey } from '@material-ui/core/colors';

const styles = theme => ({
    root: {
        width: '100%',
    },
    gridRoot: {
        flexGrow: 1,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    formControl: {
        width: '100%',
        marginTop: 16
    },
    margin: {
        marginTop: 30
    },
    title: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        minHeight: 42
    },
    panelExapnded: {
        border: '1.2px solid ' + theme.palette.primary.main,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: theme.palette.primary.main,
        margin: '0',
        minHeight: 42
    },
    panelBody: {
        backgroundColor: grey[50]
    },
    selectTitle: {
        color: theme.palette.secondary.main + ' !important',
        textTransform: 'uppercase',
    },
    titleMainPanel: {
        borderBottom: '1.5px solid ' + grey[100],
    },
    marginPanel: {
        margin: '15px 0px'
    },
    paddingChildPanel: {
        padding: 15
    },
    assistence: {
        color: theme.palette.primary.main,
        textTransform: 'uppercase',
        float: 'right'
    },
    button: {
        margin: theme.spacing.unit,
    },
    right: {
        float: 'right',
        marginTop: 20
    }
});

const mapStateToProps = (state) => (
    {
        trabajos: state.trabajos,
        tiposTrabajos: state.trabajos.tiposTrabajos ? state.trabajos.tiposTrabajos.GruposTematicos : [],
        tiposAutorizacion: state.trabajos.tiposAutorizacion ? state.trabajos.tiposAutorizacion.Tipos_autorizacion_municipal : [],
        fasesTrabajos: state.trabajos.fasesTrabajos.FasesTrabajos ? state.trabajos.fasesTrabajos.FasesTrabajos : [],
        gruposRaiz: state.trabajos.gruposRaiz ? state.trabajos.gruposRaiz.GruposRaiz : [],
        comunicacionencargo: state.trabajos.comunicacionEncargo
    }
);

const mapDispatchToProps = {
    fetchTipoTrabajo: fetchTipoTrabajo,
    fetchTipoAutorizacion: fetchTipoAutorizacion,
    fetchFasesTrabajos: fetchFasesTrabajos,
    fetchGruposRaiz: fetchGruposRaiz,
    fetchComunicacionencargo: fetchComunicacionencargo,
    dispatchError: dispatchError
};


class ComunicacionEncargo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: 'panel0',
            build: 0,
            formality: 0,
            expandedChild: null,
            swichTitleChild: 'ver',
            relationWorks: [],
            tiposObra: [],
            Description: ''
        };
    };

    async componentWillMount() {
        await this.props.fetchTipoAutorizacion(this.props.activeLanguage.code);
        await this.transformGruposRaiz();
        await this.updateFaseTrabajo(0);
    }

    async transformGruposRaiz() {
        await this.props.fetchGruposRaiz(this.props.activeLanguage.code);
        await this.comunicacionEncargo();

    }

    async comunicacionEncargo() {
        let arrayRaiz = [];
        let tiposTramite = this.props.tiposAutorizacion;
        let gruposRaiz = this.props.gruposRaiz;
        for (let i = 0; i < gruposRaiz.length; i++) {
            let value = gruposRaiz[i];
            await this.props.fetchTipoTrabajo(value.Id_Tipo_Grupo_Raiz, this.props.activeLanguage.code);
            let tiposTrabajos = this.props.tiposTrabajos;
            arrayRaiz.push({
                id: value.Id_Tipo_Grupo_Raiz,
                name: value.Nombre,
                tiposObra: tiposTrabajos,
                tiposTramite: tiposTramite,
                obraSelection: tiposTrabajos.length > 0 ? tiposTrabajos[0].Id_Tipo_Grupo_Tematico : 0,
                tramiteSelection: tiposTramite.length > 0 ? tiposTramite[0].Id_Tipo_Autorizacion_Municipal : 0,
                description: tiposTrabajos.length > 0 ? tiposTrabajos[0].Observaciones : '',
                fasesTrabajos: [[], []],
                isSelected: i === 0
            });
        }

        this.props.fetchComunicacionencargo(arrayRaiz)
    }


    handleChange = (panel, index) => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
        let updateGrupoRaiz = [];
        Object.assign(updateGrupoRaiz, this.props.comunicacionencargo);
        for (let i = 0; i < updateGrupoRaiz.length; i++) {
            updateGrupoRaiz[i].isSelected = i === index;
        }
        this.props.fetchComunicacionencargo(updateGrupoRaiz);
    };

    handleChildChange = panel => (event, expanded) => {
        this.setState({
            expandedChild: expanded ? panel : false,
            swichTitleChild: expanded && panel === 'panel12' ? 'ocultar' : 'ver'
        });
    };

    handleBuildSelect = index => event => {
        let comunicacionEncargo = this.props.comunicacionencargo[index];
        let id = event.target.value;
        this.props.fetchFasesTrabajos(id, comunicacionEncargo.tramiteSelection, this.props.activeLanguage.code);
        let indexTipoObra = comunicacionEncargo.tiposObra.findIndex(x => x.Id_Tipo_Grupo_Tematico === id);
        let updateGrupoRaiz = [];
        Object.assign(updateGrupoRaiz, this.props.comunicacionencargo);
        updateGrupoRaiz[index].obraSelection = id;
        updateGrupoRaiz[index].description = comunicacionEncargo.tiposObra[indexTipoObra].Observaciones;
        this.props.fetchComunicacionencargo(updateGrupoRaiz);
    };

    handleFormalitySelect = index => event => {
        let comunicacionEncargo = this.props.comunicacionencargo[index];
        let id = event.target.value;
        this.props.fetchFasesTrabajos(comunicacionEncargo.obraSelection, id, this.props.activeLanguage.code);
        let updateGrupoRaiz = [];
        Object.assign(updateGrupoRaiz, this.props.comunicacionencargo);
        updateGrupoRaiz[index].tramiteSelection = id;
        this.props.fetchComunicacionencargo(updateGrupoRaiz);
    }

    countItems = (relations) => {
        return relations.reduce((prev, item) => prev + item.items.length, 0);
    }

    /**
     *  El resultado será un array de array
     * @returns {*[]} objeto {category : '', items: [{Name: '', id: ''}]}
     */
    transformRelationsWorks = () => {
        var relations = [];
        var relationsData = [[], []];
        if (!this.props.trabajos.fasesTrabajos)
            return relationsData;

        this.props.trabajos.fasesTrabajos.FasesTrabajos.map(value => {
            const { Fase } = value;
            if (relations.filter(rel => rel.category === Fase).length === 0) {
                relations.push({ category: Fase, items: [] });
            }
        })
        this.props.trabajos.fasesTrabajos.FasesTrabajos.filter(value => {
            const { Fase, Trabajo_Titulo, Id_Tipo_Trabajo } = value;
            relations.forEach(element => {
                if (element.category === Fase) {
                    element.items.push({ Name: Trabajo_Titulo, id: Id_Tipo_Trabajo });
                }
            });
        })

        relations.forEach(element => {
            if (relationsData[0].length === 0) {
                relationsData[0].push(element);
            }
            else if (relationsData[1].length === 0) {
                relationsData[1].push(element);
            }
            else {
                if (this.countItems(relationsData[0]) <= this.countItems(relationsData[1])) {
                    relationsData[0].push(element);
                }
                else {
                    relationsData[1].push(element);
                }
            }
        })
        return relationsData;
    }

    async updateFaseTrabajo(index) {
        let comunicacionencargo = this.props.comunicacionencargo[index];
        await this.props.fetchFasesTrabajos(comunicacionencargo.obraSelection, comunicacionencargo.tramiteSelection, this.props.activeLanguage.code);
    }

    renderRelationWorks = () => {
        const { classes } = this.props;
        let relationsData = this.transformRelationsWorks();
        return (
            <Grid container spacing={32}>
                <Grid item xs={6}>
                    {
                        relationsData[0].map((value, index) => {
                            return <Grid item xs={12} key={index} className={classes.paddingChildPanel}>
                                <Typography variant="subtitle2" gutterBottom>{value.category}</Typography>
                                {value.items.map((item, itemIndex) => {
                                    return <Typography key={itemIndex} variant="subtitle1" gutterBottom>{item.Name}</Typography>
                                })}
                            </Grid>
                        })
                    }
                </Grid>
                <Grid item xs={6} >
                    {
                        relationsData[1].map((value, index) => {
                            return <Grid item xs={12} key={index} className={classes.paddingChildPanel}>
                                <Typography variant="subtitle2" gutterBottom>{value.category}</Typography>
                                {value.items.map((item, itemIndex) => {
                                    return <Typography key={itemIndex} variant="subtitle1" gutterBottom>{item.Name}</Typography>
                                })}
                            </Grid>
                        })
                    }
                </Grid>
            </Grid>
        )
    }

    /**Función que valida la continuación en el wizard */
    handleNext() {
        if (this.props.trabajos.fasesTrabajos && 
            this.props.trabajos.fasesTrabajos.FasesTrabajos && 
            this.props.trabajos.fasesTrabajos.FasesTrabajos.length === 0) {
            this.props.dispatchError("No existen trabajos relacionados para el tipo de obra " +
                "y la autorización municipal selecccionada");
        }
        else{
            this.props.history.push("/comunicacion/agentes");
        }
    }

    render() {
        let { classes } = this.props;
        let { expandedChild, expanded } = this.state;

        return (
            <Container className={classes.margin}>
                <ExpansionPanel expanded={true}>
                    <ExpansionPanelSummary className={classes.titleMainPanel}
                        style={{ minHeight: 48, height: 48 }}>
                        <Grid container spacing={16} style={{ padding: '0 15px' }}>
                            <Grid item xs={6}>
                                <Translate id="languages.comunicacionEncargo.titleEligeTipoExpeiente" />
                            </Grid>
                        </Grid>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container spacing={24} className={classes.marginPanel}>
                            <Grid item xs={12}>
                                {
                                    this.props.comunicacionencargo && this.props.comunicacionencargo.map((value, index) => {
                                        return <ExpansionPanel key={index} expanded={expanded === `panel${index}`} onChange={this.handleChange(`panel${index}`, index)}>
                                            <ExpansionPanelSummary style={{ minHeight: 48, height: 48 }}
                                                expandIcon={expanded === `panel${index}` ? <ExpandMoreIcon color="primary" /> : <ExpandMoreIcon color="secondary" />}
                                                className={expanded === `panel${index}` ? classes.panelExapnded : classes.title}
                                                onClick={() => { this.updateFaseTrabajo(index) }}>
                                                {value.name}
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails className={classes.panelBody}>
                                                <div className={classes.gridRoot}>
                                                    <Grid container spacing={24}>
                                                        <Grid item xs={4}>
                                                            <FormControl className={classes.formControl}>
                                                                <InputLabel className={classes.selectTitle} htmlFor="build-type">
                                                                    <Translate id="languages.comunicacionEncargo.fieldTipoObra" />
                                                                </InputLabel>
                                                                <Select
                                                                    value={this.props.comunicacionencargo[index].obraSelection}
                                                                    onChange={this.handleBuildSelect(index)}
                                                                    inputProps={{ name: 'build', id: 'build-type' }}>
                                                                    {value.tiposObra.map((value, index) => {
                                                                        return <MenuItem key={index} value={value.Id_Tipo_Grupo_Tematico}>{value.Nombre}</MenuItem>
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item xs={4}>
                                                            <FormControl className={classes.formControl}>
                                                                <InputLabel className={classes.selectTitle} htmlFor="tramit-type">
                                                                    <Translate id="languages.comunicacionEncargo.fieldTipoTramite" />
                                                                </InputLabel>
                                                                <Select
                                                                    value={this.props.comunicacionencargo[index].tramiteSelection}
                                                                    onChange={this.handleFormalitySelect(index)}
                                                                    inputProps={{ name: 'tramite', id: 'tramit-type' }}>
                                                                    {
                                                                        value.tiposTramite.map((value, index) => {
                                                                            return <MenuItem key={index} value={value.Id_Tipo_Autorizacion_Municipal}>{value.Nombre}</MenuItem>
                                                                        })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item xs={12}>
                                                            <ExpansionPanel expanded={expandedChild === 'panel11'} onChange={this.handleChildChange('panel11')}>
                                                                <ExpansionPanelSummary expandIcon={expandedChild === 'panel11' ? <ExpandMoreIcon color="primary" /> : <ExpandMoreIcon color="secondary" />}
                                                                    className={expandedChild === 'panel11' ? classes.panelExapnded : classes.title}
                                                                    style={{ minHeight: 48, height: 48 }}>
                                                                    <Translate id="languages.comunicacionEncargo.titleVerDescription" />
                                                                </ExpansionPanelSummary>
                                                                <ExpansionPanelDetails>
                                                                    <ReactQuill value={this.props.comunicacionencargo[index].description} onChange={this.handleChange} readOnly theme='bubble' />
                                                                </ExpansionPanelDetails>
                                                            </ExpansionPanel>

                                                            <ExpansionPanel expanded={expandedChild === 'panel12'}
                                                                onChange={this.handleChildChange('panel12')} >
                                                                <ExpansionPanelSummary expandIcon={expandedChild === 'panel12' ? <ExpandMoreIcon color="primary" /> : <ExpandMoreIcon color="secondary" />}
                                                                    className={expandedChild === 'panel12' ? classes.panelExapnded : classes.title}
                                                                    style={{ minHeight: 48, height: 48 }}>
                                                                    {this.state.swichTitleChild} <Translate id="languages.comunicacionEncargo.titleTrabajoPosiblesTramitar" />
                                                                </ExpansionPanelSummary>
                                                                <ExpansionPanelDetails>
                                                                    <Grid container spacing={24} className={classes.marginPanel}>
                                                                        {
                                                                            this.renderRelationWorks()
                                                                        }
                                                                    </Grid>
                                                                </ExpansionPanelDetails>
                                                            </ExpansionPanel>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    })
                                }
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>


                <div className={classes.right}>
                    <Button color="primary" className={classes.button}>
                        Cancelar<Close className={classes.rightIcon} />
                    </Button>
                    <Button variant="contained" color="primary" className={classes.button}
                        onClick={() => { this.handleNext() }}>
                        Siguiente<Next className={classes.rightIcon} />
                    </Button>
                </div>
            </Container>
        );
    }
}

ComunicacionEncargo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(ComunicacionEncargo)));