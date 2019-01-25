import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import {infoCarpetasTrabajo, getTiposTramite} from "../../api";
import {groupBy, filter} from 'lodash';
import {Grid, List, ListItem, ListSubheader, Divider, Button, Typography, FormControl, MenuItem, Select, RadioGroup, FormControlLabel, Radio, CircularProgress} from "@material-ui/core";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/Add';
import ExpandMore from '@material-ui/icons/Close';
const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    root: {
        width: '100%',
        paddingTop: 0
    },
    item: {
        border: "solid 1px" + theme.palette.secondary.light,
        paddingTop: 0, paddingBottom: 0
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    button: {
        margin: theme.spacing.unit,
    },
    expand: {
        marginRight: 8,
        fontSize: 'medium'
    }
})

class CrearTrabajo extends Component{
    constructor(props){
        super(props);
        this.state = {
            tiposTrabajos: [
                        {
                            "Id_Tipo_Grupo_Tematico": 1,
                            "Id_Tipo_Autorizacion_Municipal": 1,
                            "id_tipo_trabajo": 250,
                            "Id_Tipo_Tramite": 0,
                            "es_modificado": 0,
                            "Fase": "Proyecto",
                            "Id_Tipo_Fase": 1,
                            "Trabajo_Titulo": "Proyecto de ejecución",
                            "Obligatorio": "visado",
                        },
                        {
                            "Id_Tipo_Grupo_Tematico": 1,
                            "Id_Tipo_Autorizacion_Municipal": 1,
                            "id_tipo_trabajo": 233,
                            "Id_Tipo_Tramite": 0,
                            "es_modificado": 0,
                            "Fase": "Proyecto",
                            "Id_Tipo_Fase": 1,
                            "Trabajo_Titulo": "Estudios previos",
                            "Obligatorio": null,
                        }
                ],
            tiposTramites: [],
            inforCarpetas: [],
            isCarpetas: false,
        }
    }

    async componentWillMount(){
        this.groupByFases();
        await this.getTiposTramites()
    }

   async getTiposTramites(){
        let response = await getTiposTramite(1) /*TODO: Poner Idioma*/
        if (response.data && response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0) {
            this.props.fetchErrorExpediente(response.data);
        }
        else {
            let tiposTramites = response.data.Tipos_Trabajos_Tramites;
            this.setState({tiposTramites: tiposTramites});
        }
    }

    groupByFases(){
       let tiposTrabajos = groupBy(this.state.tiposTrabajos, 'Fase');
       this.setState({tiposTrabajos: tiposTrabajos});
    }

    async getInfoCarpetasTrabajo(id_tipo_trabajo, id_tipo_tramite, es_modificado){
        let inforCarpetas = [];
        let response = await infoCarpetasTrabajo(id_tipo_trabajo, id_tipo_tramite, es_modificado, 1);/*TODO: Poner el idioma*/
        if (response.data && response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0) {
            this.props.fetchErrorExpediente(response.data);
        }
        else {
            let carpetas = response.data.Carpetas;
            let father = filter(carpetas, {'Id_Documentacion_Padre': null});
            let children = groupBy(carpetas, 'Id_Documentacion_Padre');
            let fatherChildren = [];
            father.map(value => {
                value["children"] = children[value.Id_Documentacion]
                fatherChildren.push(value) ;
            })
            inforCarpetas = fatherChildren;
        }
        this.setState({inforCarpetas: inforCarpetas});
    }

    handleChange = (fase, index, name) => event => {
        let tiposTrabajos = {};
        Object.assign(tiposTrabajos, this.state.tiposTrabajos);
        tiposTrabajos[fase][index][name] = event.target.value;
        this.setState({tiposTrabajos: tiposTrabajos});
    };

    async handleChangePanel(id_tipo_trabajo, id_tipo_tramite, es_modificado){
        this.setState({isCarpetas: true});
        await this.getInfoCarpetasTrabajo(id_tipo_trabajo, id_tipo_tramite, es_modificado);

        console.log(this.state.inforCarpetas);
        this.setState({isCarpetas: false});
    }

    handleClick = (index) => {
        let carpetas = {};
        Object.assign(carpetas, this.state.inforCarpetas);
        carpetas[index]['open'] = this.state.inforCarpetas[index]['open'] ? !this.state.inforCarpetas[index]['open'] : true;
        this.setState({carpetas: carpetas});
    };

    render(){
        let {classes} = this.props;
        let {tiposTrabajos, tiposTramites} = this.state;
        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Translate id="languages.trabajo.trabajoTramitarTitle"/>
                </Grid>
                <Grid item xs={12}>
                    {
                        tiposTramites.length > 0 ?
                       <div>
                            {Object.keys(tiposTrabajos).map((fase, indexFase) => {
                                let trabajos = tiposTrabajos[fase];
                                return <List key={indexFase}
                                    subheader={<ListSubheader component="div">{fase}</ListSubheader>}
                                    className={classes.root}
                                >
                                    <ListItem className="pt-0">
                                        <List
                                              className={classes.root}>
                                            {
                                                trabajos.map((trabajo, indexTrabajo) => {
                                                    return <ListItem key={indexTrabajo} className={classes.item}>
                                                            <Grid container spacing={8}>
                                                                <Grid item xs={12}>
                                                                    <Grid container spacing={0}>
                                                                        <Grid item xs={2} md={2} className="align-self-center">
                                                                            <Typography variant="button" gutterBottom>
                                                                                {trabajo.Trabajo_Titulo}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={3} md={2} className="align-self-center">
                                                                            <FormControl className={classes.formControl}>
                                                                                <Select
                                                                                    value={trabajo.Id_Tipo_Tramite}
                                                                                    displayEmpty
                                                                                    onChange={this.handleChange(fase,indexTrabajo,'Id_Tipo_Tramite')}
                                                                                    inputProps={{
                                                                                        name: 'Id_Tipo_Tramite',
                                                                                        id: 'Id_Tipo_Tramite',
                                                                                    }}
                                                                                >
                                                                                    <MenuItem value="">
                                                                                        <em>None</em>
                                                                                    </MenuItem>
                                                                                    {tiposTramites.map(tramite => (
                                                                                        <MenuItem
                                                                                            value={tramite.Id_Tipo_Tramite}>{tramite.Nombre}</MenuItem>
                                                                                    ))}

                                                                                </Select>
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid item xs={7} md={8} className="align-self-center">
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    aria-label="Gender"
                                                                                    name="gender1"
                                                                                    className={classes.group}
                                                                                    value={trabajo.defaultSelect ? trabajo.defaultSelect : "Es_Trabajo_Nuevo"}
                                                                                    onChange={this.handleChange(fase,indexTrabajo,'defaultSelect')}
                                                                                    row
                                                                                >
                                                                                    <FormControlLabel value="Es_Trabajo_Nuevo"
                                                                                                      control={<Radio/>} label={<Translate
                                                                                        id="languages.trabajo.nuevoTrabajoTitle"/>}
                                                                                                      labelPlacement="start" className="mt-2 text-uppercase"/>
                                                                                    <FormControlLabel
                                                                                        value="Es_Trabajo_Modificado_Sustancial"
                                                                                        control={<Radio/>} label={<Translate
                                                                                        id="languages.trabajo.modificacionSustancialTitle" />}
                                                                                        labelPlacement="start" className="mt-2 text-uppercase"/>
                                                                                    <FormControlLabel
                                                                                        value="Es_Trabajo_Modificado_Correcion_Basica"
                                                                                        control={<Radio/>} label={<Translate
                                                                                        id="languages.trabajo.correccionBasicaTitle"/>}
                                                                                        labelPlacement="start" className="mt-2 text-uppercase"/>
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Divider style={{width: '100%'}}/>
                                                                <Grid item xs={12}>
                                                                    <ExpansionPanel className="shadow-none" onChange={()=>{this.handleChangePanel(trabajo.id_tipo_trabajo, trabajo.Id_Tipo_Tramite, trabajo.defaultSelect ? trabajo.defaultSelect : "Es_Trabajo_Nuevo")}}>
                                                                        <ExpansionPanelSummary className="p-0" expandIcon={<ExpandMoreIcon />}>
                                                                            <Grid container spacing={0}>
                                                                                <Grid item xs={12}>
                                                                                    <Typography variant="button" gutterBottom>
                                                                                        Previsualizacion de carpetas
                                                                                    </Typography>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </ExpansionPanelSummary>
                                                                        <ExpansionPanelDetails>
                                                                            {this.state.isCarpetas ? <CircularProgress/>
                                                                             : <Grid container spacing={0}>
                                                                                    <Grid item xs={12}>
                                                                                        <Grid container spacing={0}>
                                                                                            <Grid item xs={4}>
                                                                                                <Typography variant="button" gutterBottom>
                                                                                                    {trabajo.Trabajo_Titulo}
                                                                                                </Typography>
                                                                                            </Grid>
                                                                                            <Grid item xs={4}>
                                                                                                <Typography variant="button" gutterBottom>
                                                                                                    Firmas requeridas
                                                                                                </Typography>
                                                                                            </Grid>
                                                                                            <Grid item xs={4}>
                                                                                                <Typography variant="button" gutterBottom>
                                                                                                    Aclaraciones
                                                                                                </Typography>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    <Grid item xs={12}>
                                                                                        {
                                                                                            this.state.inforCarpetas.map((carpeta, indexCarpeta)=>{
                                                                                                return <List key={indexCarpeta} component="div" disablePadding>

                                                                                                    <ListItem button onClick={()=>{this.handleClick(indexCarpeta)}} className="pt-0 pb-0">
                                                                                                        <Grid container spacing={0}>
                                                                                                            <Grid item xs={4} className="d-flex align-self-center">
                                                                                                                {carpeta.open ? <ExpandLess className={classes.expand}/> : <ExpandMore className={classes.expand}/>}
                                                                                                                <Typography variant="body1" gutterBottom>
                                                                                                                    {carpeta.Nombre}
                                                                                                                </Typography>

                                                                                                            </Grid>
                                                                                                            <Grid item xs={4} className="align-self-center">
                                                                                                                <Typography variant="body1" gutterBottom>
                                                                                                                     --
                                                                                                                </Typography>
                                                                                                            </Grid>
                                                                                                            <Grid item xs={4} className="align-self-center">
                                                                                                                <Button color="primary">
                                                                                                                    Más info
                                                                                                                </Button>
                                                                                                            </Grid>
                                                                                                        </Grid>
                                                                                                    </ListItem>
                                                                                                    <Collapse in={carpeta.open ? carpeta.open : false} timeout="auto" unmountOnExit>
                                                                                                        <List component="div" disablePadding>
                                                                                                            <ListItem className="pt-0 pb-0 pl-5">
                                                                                                                <List component="div" disablePadding style={{width: '100%'}}>
                                                                                                                    {carpeta.children && carpeta.children.map((c,i)=>{
                                                                                                                        return <ListItem className="pt-0 pb-0">
                                                                                                                            <Grid container spacing={0}>
                                                                                                                                <Grid item xs={4}>
                                                                                                                                    <Typography variant="body1" gutterBottom>
                                                                                                                                        {c.Nombre}
                                                                                                                                    </Typography>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xs={4}>
                                                                                                                                    <Typography variant="body1" gutterBottom>
                                                                                                                                        {c.Firmas_Requeridas}
                                                                                                                                    </Typography>
                                                                                                                                </Grid>
                                                                                                                                <Grid item xs={4}>
                                                                                                                                    <Button color="primary" className="ml-1">
                                                                                                                                        Más info
                                                                                                                                    </Button>
                                                                                                                                </Grid>
                                                                                                                            </Grid>
                                                                                                                        </ListItem>
                                                                                                                    })}
                                                                                                                </List>
                                                                                                            </ListItem>
                                                                                                        </List>
                                                                                                    </Collapse>
                                                                                                </List>
                                                                                            })
                                                                                        }
                                                                                    </Grid>
                                                                                </Grid>
                                                                            }

                                                                        </ExpansionPanelDetails>
                                                                    </ExpansionPanel>

                                                                </Grid>

                                                            </Grid>

                                                    </ListItem>
                                                })
                                            }
                                        </List>
                                    </ListItem>
                                </List>
                            })}
                       </div>
                            :
                          <CircularProgress/>
                    }
                </Grid>
            </Grid>
        );
    }

}

export default withLocalize(withStyles(styles)(CrearTrabajo));