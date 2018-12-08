import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { fetchFasesTrabajos, fetchTipoAutorizacion, fetchTipoTrabajo, fetchGruposRaiz } from "../../actions/trabajos";
import { connect } from "react-redux";
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@material-ui/core";
import { Container } from "reactstrap";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Next from '@material-ui/icons/NavigateNext';
import Close from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { getTipoObra, getGruposRaiz } from '../../api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
        width: '100%'
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
        backgroundColor: theme.palette.secondary.light
    },
    selectTitle: {
        color: theme.palette.secondary.main + ' !important',
        textTransform: 'uppercase',
    },
    titleMainPanel: {
        borderBottom: '1.5px solid ' + theme.palette.secondary.medium,
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
        tiposAutorizacion: state.trabajos.tiposAutorizacion.data ? state.trabajos.tiposAutorizacion.data.Tipos_autorizacion_municipal : [],
        fasesTrabajos: state.trabajos.fasesTrabajos.FasesTrabajos ? state.trabajos.fasesTrabajos.FasesTrabajos : [],
        loading: state.expedientes.loading,
        gruposRaiz: state.trabajos.gruposRaiz
    }
);

const mapDispatchToProps =  {
        fetchTipoTrabajo: fetchTipoTrabajo,
        fetchTipoAutorizacion: fetchTipoAutorizacion,
        fetchFasesTrabajos: fetchFasesTrabajos,
        fetchGruposRaiz: fetchGruposRaiz
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
        await this.props.fetchTipoAutorizacion(1);
        await this.transformGruposRaiz();
        this.updateFaseTrabajo(0);
    }

    async transformGruposRaiz() {
        let gruposRaiz = await this.getGruposRaiz();
        let arrayRaiz = [];
        let tiposTramite = this.props.tiposAutorizacion;
        if (gruposRaiz.data && gruposRaiz.data.GruposRaiz) {
            arrayRaiz = await this.gruposRaizData(gruposRaiz, tiposTramite);
        }
        this.props.fetchGruposRaiz(arrayRaiz);
        console.log("arrayRaiz",arrayRaiz);
    }

    async gruposRaizData(gruposRaiz, tiposTramite) {
        let arrayRaiz = [];
        let language = 1;
        for (let i = 0; i < gruposRaiz.data.GruposRaiz.length; i++) {
            let value = gruposRaiz.data.GruposRaiz[i];
            let tiposObra = await getTipoObra(value.Id_Tipo_Grupo_Raiz, language);
            tiposObra = tiposObra.data ? tiposObra.data.GruposTematicos : [];

            arrayRaiz.push({
                id: value.Id_Tipo_Grupo_Raiz,
                name: value.Nombre,
                tiposObra: tiposObra,
                tiposTramite: tiposTramite,
                obraSelection: tiposObra.length > 0 ? tiposObra[0].Id_Tipo_Grupo_Tematico : 0,
                tramiteSelection: tiposTramite.length > 0 ? tiposTramite[0].Id_Tipo_Autorizacion_Municipal : 0,
                description: tiposObra.length > 0 ? tiposObra[0].Observaciones : '',
                fasesTrabajos: [[], []]
            });
        }
        return arrayRaiz;
    }


    async getGruposRaiz() {
        try {
            let response = await getGruposRaiz();
            return response;
        }
        catch (e) {
            console.log(e);
        }
    }

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    handleChildChange = panel => (event, expanded) => {
        this.setState({
            expandedChild: expanded ? panel : false,
            swichTitleChild: expanded && panel === 'panel12' ? 'ocultar' : 'ver'
        });
    };

    handleBuildSelect = index => event => {
        let gruposRaiz = this.props.gruposRaiz[index];
        let id = event.target.value;
        this.props.fetchFasesTrabajos(id, gruposRaiz.tramiteSelection, 1);
        let indexTipoObra = gruposRaiz.tiposObra.findIndex(x=> x.Id_Tipo_Grupo_Tematico === id);
        let updateGrupoRaiz = [];
        Object.assign(updateGrupoRaiz,this.props.gruposRaiz);
        updateGrupoRaiz[index].obraSelection = id;
        updateGrupoRaiz[index].description = gruposRaiz.tiposObra[indexTipoObra].Observaciones;
        this.props.fetchGruposRaiz(updateGrupoRaiz);
    };

    handleFormalitySelect = index => event => {
        let gruposRaiz = this.props.gruposRaiz[index];
        let id = event.target.value;
        this.props.fetchFasesTrabajos(gruposRaiz.obraSelection, id, 1);
        let updateGrupoRaiz = [];
        Object.assign(updateGrupoRaiz,this.props.gruposRaiz);
        updateGrupoRaiz[index].tramiteSelection = id;
        this.props.fetchGruposRaiz(updateGrupoRaiz);
    }

    countItems = (relations) => {
        return relations.reduce((prev, item) => prev + item.items.length, 0);
    }

    transformRelationsWorks = () => {
        var relations = [];
        var relationsData = [[], []];
        if (!this.props.trabajos.fasesTrabajos.data)
            return relationsData;

        this.props.trabajos.fasesTrabajos.data.FasesTrabajos.map(value => {
            const { Fase } = value;
            if (relations.filter(rel => rel.category === Fase).length === 0) {
                relations.push({ category: Fase, items: [] });
            }
        })
        this.props.trabajos.fasesTrabajos.data.FasesTrabajos.filter(value => {
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
        /*
        * El resultado será un array de array 
        * y el objeto {category : '', items: [{Name: '', id: ''}]} 
        */
        return relationsData;
    }

    updateFaseTrabajo(index){
        let currentGrupoRaiz = this.props.gruposRaiz[index];
        this.props.fetchFasesTrabajos(currentGrupoRaiz.obraSelection, currentGrupoRaiz.tramiteSelection,1);
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
                                Elige el tipo de expediente
                                    </Grid>
                            <Grid item xs={6}>
                                <div className={classes.assistence}>Abrir asistente</div>
                            </Grid>
                        </Grid>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container spacing={24} className={classes.marginPanel}>
                            <Grid item xs={12}>
                                {
                                    this.props.gruposRaiz && this.props.gruposRaiz.map((value, index) => {
                                        return <ExpansionPanel expanded={expanded === `panel${index}`} onChange={this.handleChange(`panel${index}`)}>
                                            <ExpansionPanelSummary style={{ minHeight: 48, height: 48 }}
                                                expandIcon={expanded === `panel${index}` ? <ExpandMoreIcon color="primary" /> : <ExpandMoreIcon color="secondary" />}
                                                className={expanded === `panel${index}` ? classes.panelExapnded : classes.title}
                                                onClick={()=>{this.updateFaseTrabajo(index)}}>
                                                {value.name}
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails className={classes.panelBody}>
                                                <div className={classes.gridRoot}>
                                                    <Grid container spacing={24}>
                                                        <Grid item xs={4}>
                                                            <FormControl className={classes.formControl}>
                                                                <InputLabel className={classes.selectTitle} htmlFor="build-type">Tipo de Obra</InputLabel>
                                                                <Select
                                                                    value={this.props.gruposRaiz[index].obraSelection}
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
                                                                <InputLabel className={classes.selectTitle} htmlFor="tramit-type">Tipo de Trámite</InputLabel>
                                                                <Select
                                                                    value={this.props.gruposRaiz[index].tramiteSelection}
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
                                                                    Ver descripción
                                                                </ExpansionPanelSummary>
                                                                <ExpansionPanelDetails>
                                                                    <ReactQuill value={this.props.gruposRaiz[index].description} onChange={this.handleChange} readOnly theme='bubble' />
                                                                </ExpansionPanelDetails>
                                                            </ExpansionPanel>

                                                            <ExpansionPanel expanded={expandedChild === 'panel12'}
                                                                onChange={this.handleChildChange('panel12')} >
                                                                <ExpansionPanelSummary expandIcon={expandedChild === 'panel12' ? <ExpandMoreIcon color="primary" /> : <ExpandMoreIcon color="secondary" />}
                                                                    className={expandedChild === 'panel12' ? classes.panelExapnded : classes.title}
                                                                    style={{ minHeight: 48, height: 48 }}>
                                                                    {this.state.swichTitleChild} trabajos que es posible tramitar conforme al tipo de expediente y tramitación elegido
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
                        Cancelar
                                <Close className={classes.rightIcon} />
                    </Button>
                    <Button variant="contained" color="primary" className={classes.button}>
                        Siguiente
                                <Next className={classes.rightIcon} />
                    </Button>
                </div>
            </Container>
        );
    }
}

ComunicacionEncargo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ComunicacionEncargo));