import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { infoCarpetasTrabajo, getTiposTramite, addTrabajoEncomendaExpediente } from "../../api";
import { groupBy, filter } from 'lodash';
import {
    Grid, List, ListItem, ListSubheader,  Button, Typography, FormControl, MenuItem, Select,
    RadioGroup, FormControlLabel, Radio, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@material-ui/core";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/Add';
import ExpandMore from '@material-ui/icons/Close';
import { withRouter } from "react-router-dom";
import { fetchErrorExpediente } from "../../actions/expedientes";
import { connect } from "react-redux";
import ReactQuill from "react-quill";
const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    root: {
        width: '100%',
        paddingTop: 0,
        borderTop: "solid 1px" + theme.palette.secondary.light,
    },
    item: {
        borderTop: "solid 1px" + theme.palette.secondary.light,
        paddingTop: 0, paddingBottom: 0
    },
    border: {
        borderLeft: "solid 1px" + theme.palette.secondary.light,
        borderRight: "solid 1px" + theme.palette.secondary.light,
        borderBottom: "solid 1px" + theme.palette.secondary.light,
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
    },
    subHeader: {
        backgroundColor: theme.palette.default
    }
})

class CrearTrabajo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tiposTrabajos: this.props.trabajos,
            tiposTramites: [],
            inforCarpetas: [],
            isCarpetas: false,
            expanded: null,
            dialogOpen: false,
            dialogTitle: "",
            dialogContent: ""
        }
    }

    async componentWillMount() {
        this.groupByFases();
        await this.getTiposTramites()
    }

    getIdTipoTramite(Name) {
        let id = 0;
        if (!Name) return id;
        let tramite = this.state.tiposTramites.find(t => t.Nombre.toUpperCase() === Name.toUpperCase());
        if (tramite) {
            id = tramite.Id_Tipo_Tramite;
        }
        return id;
    }

    async getTiposTramites() {
        let response = await getTiposTramite(this.props.activeLanguage.code)
        if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
            this.props.fetchErrorExpediente(response);
        }
        else {
            let tiposTramites = response.Tipos_Trabajos_Tramites;
            this.setState({ tiposTramites: tiposTramites });
        }
    }

    groupByFases() {
        let tiposTrabajos = groupBy(this.state.tiposTrabajos, 'Fase');
        this.setState({ tiposTrabajos: tiposTrabajos });
    }

    async getInfoCarpetasTrabajo(id_tipo_trabajo, id_tipo_tramite, es_modificado) {
        let inforCarpetas = [];
        let response = await infoCarpetasTrabajo(id_tipo_trabajo, id_tipo_tramite ? id_tipo_tramite : 0, es_modificado, this.props.activeLanguage.code);/*TODO: Poner el idioma*/
        if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
            this.props.fetchErrorExpediente(response);
        }
        else {
            let carpetas = response.Carpetas;
            let father = filter(carpetas, { 'Id_Documentacion_Padre': null });
            let children = groupBy(carpetas, 'Id_Documentacion_Padre');
            let fatherChildren = [];
            father.map(value => {
                value["children"] = children[value.Id_Documentacion]
                fatherChildren.push(value);
                return null
            })
            inforCarpetas = fatherChildren;
        }
        this.setState({ inforCarpetas: inforCarpetas });
    }

    handleChange = (fase, index, name) => async event => {
        let tiposTrabajos = {};
        Object.assign(tiposTrabajos, this.state.tiposTrabajos);
        tiposTrabajos[fase][index][name] = event.target.value;
        let trabajo = tiposTrabajos[fase][index];
        let tipoTramite = 0;
        if(name === 'Id_Tipo_Tramite'){
            tipoTramite = this.state.tiposTramites.find(t=>t.Id_Tipo_Tramite === event.target.value);
            tiposTrabajos[fase][index]['Obligatorio']= tipoTramite.Nombre;
            await this.updateInfoCarpeta(trabajo.Id_Tipo_Trabajo, tipoTramite.Id_Tipo_Tramite, trabajo.defaultSelect, trabajo.Id_Tipo_Trabajo);

        }else {
            let idTipoTramite = this.getIdTipoTramite(tiposTrabajos[fase][index]['Obligatorio']);
            await this.updateInfoCarpeta(trabajo.Id_Tipo_Trabajo, idTipoTramite, event.target.value, trabajo.Id_Tipo_Trabajo);
        }

        this.setState({ tiposTrabajos: tiposTrabajos });

    };


     handleChangePanel = (id_tipo_trabajo, id_tipo_tramite, es_modificado)  => async(event, expanded) =>{
        await this.updateInfoCarpeta(id_tipo_trabajo, id_tipo_tramite, es_modificado, expanded)
    }

    async updateInfoCarpeta(id_tipo_trabajo, id_tipo_tramite, es_modificado, expanded){
        this.setState({  expanded: expanded ? id_tipo_trabajo : false, isCarpetas: true });
        if(id_tipo_tramite !== undefined){
            await this.getInfoCarpetasTrabajo(id_tipo_trabajo, id_tipo_tramite, es_modificado === "Es_Trabajo_Nuevo" ? 0 : 1);
        }
        this.setState({ isCarpetas: false });
    }

    handleClick = (index) => {
        let carpetas = {};
        Object.assign(carpetas, this.state.inforCarpetas);
        carpetas[index]['open'] = this.state.inforCarpetas[index]['open'] ? !this.state.inforCarpetas[index]['open'] : true;
        this.setState({ carpetas: carpetas });
    };

     async handleCrearTrabajo(){
         let idExpediente = this.props.match.params.id;
         let {tiposTrabajos} = this.state;
          let trabajos = [];
          Object.values(tiposTrabajos).map(fase=>{
              fase.map(t=>{
                  trabajos.push({
                      "Id_Tipo_Fase": t.Id_Tipo_Fase,
                      "Id_Tipo_Trabajo": t.Id_Tipo_Trabajo,
                      "Id_Tipo_Tramite": t.Id_Tipo_Tramite ? t.Id_Tipo_Tramite : 0,
                      "Es_Trabajo_Nuevo": t.defaultSelect === "Es_Trabajo_Nuevo" ? 1 : 0,
                      "Es_Trabajo_Modificado_Correcion_Basica": t.defaultSelect === "Es_Trabajo_Modificado_Correcion_Basica" ? 1 : 0,
                      "Es_Trabajo_Modificado_Sustancial": t.defaultSelect === "Es_Trabajo_Modificado_Sustancial" ? 1 : 0,
                      "Es_Trabajo_Modificado_Requerido_Administracion": 0,
                      "Envio_administracion":0
                  })
                  return null
              })
              return null
          });

          let data = {
              "Trabajos": trabajos,
              "IgnorarObservaciones":1
          }
         let response = await addTrabajoEncomendaExpediente(idExpediente, data);
         if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
             this.props.fetchErrorExpediente(response);
         }
         else {
             this.props.history.push("/visualizar-expediente/" + idExpediente + "/" + response.Trabajos[0].Id_Trabajo);
         }
     }

     handleShowDialog(title, content) {
         this.setState({dialogOpen: true, dialogTitle: title, dialogContent: content});
     }

    handleCloseDialog = () => {
        this.setState({ dialogOpen: false });
    };

    render() {
        let { classes } = this.props;
        let { tiposTrabajos, tiposTramites, expanded } = this.state;
        return (
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Translate id="languages.trabajo.trabajoTramitarTitle" />
                </Grid>
                <Grid item xs={12}>
                    {
                        tiposTramites.length > 0 ?
                            <Grid container spacing={0} className={classes.border}>
                                <Grid item xs={12}>
                                    {Object.keys(tiposTrabajos).map((fase, indexFase) => {
                                        let trabajos = tiposTrabajos[fase];
                                        return <List key={indexFase} classes={{subheader: classes.subHeader}}
                                            subheader={<ListSubheader component="div" color="secondary" className={classes.subHeader} classes={{root: classes.subHeader}} >{fase}</ListSubheader>}
                                            className={classes.root}
                                        >
                                            <ListItem className="p-0">
                                                <List
                                                    className={classes.root}>
                                                    {
                                                        trabajos.map((trabajo, indexTrabajo) => {
                                                            let idTipoTramite = this.getIdTipoTramite(trabajo.Obligatorio);
                                                            return <ListItem key={indexTrabajo} className={classes.item}>
                                                                <Grid container spacing={8}>
                                                                    <Grid item xs={12}>
                                                                        <div className="d-flex align-items-center justify-content-between">
                                                                            <Typography variant="button" gutterBottom className="mb-0">
                                                                                {trabajo.Trabajo_Titulo}
                                                                            </Typography>
                                                                            <FormControl className={classes.formControl}>
                                                                                <Select
                                                                                    value={idTipoTramite}
                                                                                    displayEmpty
                                                                                    onChange={this.handleChange(fase, indexTrabajo, 'Id_Tipo_Tramite')}
                                                                                    inputProps={{
                                                                                        name: 'Id_Tipo_Tramite',
                                                                                        id: 'Id_Tipo_Tramite',
                                                                                    }}
                                                                                >

                                                                                    {tiposTramites.map(tramite => (
                                                                                        <MenuItem
                                                                                            value={tramite.Id_Tipo_Tramite}>{tramite.Nombre}</MenuItem>
                                                                                    ))}

                                                                                </Select>
                                                                            </FormControl>
                                                                            <FormControl>
                                                                                <RadioGroup
                                                                                    aria-label="Gender"
                                                                                    name="gender1"
                                                                                    className={classes.group}
                                                                                    value={trabajo.defaultSelect ? trabajo.defaultSelect : "Es_Trabajo_Nuevo"}
                                                                                    onChange={this.handleChange(fase, indexTrabajo, 'defaultSelect')}
                                                                                    row
                                                                                >
                                                                                    <FormControlLabel value="Es_Trabajo_Nuevo"
                                                                                                      control={<Radio />} label={<Translate
                                                                                        id="languages.trabajo.nuevoTrabajoTitle" />}
                                                                                                      labelPlacement="start" className="mt-2 text-uppercase" />
                                                                                    <FormControlLabel
                                                                                        value="Es_Trabajo_Modificado_Sustancial"
                                                                                        control={<Radio />} label={<Translate
                                                                                        id="languages.trabajo.modificacionSustancialTitle" />}
                                                                                        labelPlacement="start" className="mt-2 text-uppercase" />
                                                                                    <FormControlLabel
                                                                                        value="Es_Trabajo_Modificado_Correcion_Basica"
                                                                                        control={<Radio />} label={<Translate
                                                                                        id="languages.trabajo.correccionBasicaTitle" />}
                                                                                        labelPlacement="start" className="mt-2 text-uppercase" />
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                        </div>

                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <ExpansionPanel className="shadow-none" expanded={expanded === trabajo.Id_Tipo_Trabajo} onChange={this.handleChangePanel(trabajo.Id_Tipo_Trabajo, idTipoTramite, trabajo.defaultSelect ? trabajo.defaultSelect : "Es_Trabajo_Nuevo") }>
                                                                            <ExpansionPanelSummary className="p-0" expandIcon={<ExpandMoreIcon />}>
                                                                                <Grid container spacing={0}>
                                                                                    <Grid item xs={12}>
                                                                                        <Typography variant="button" gutterBottom>
                                                                                            <Translate id="languages.trabajo.previCarpetaTitle" />
                                                                                        </Typography>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </ExpansionPanelSummary>
                                                                            <ExpansionPanelDetails>
                                                                                {this.state.isCarpetas ? <CircularProgress />
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
                                                                                        <Grid item xs={12} style={{backgroundColor: "#fafafa"}}>
                                                                                            {
                                                                                                this.state.inforCarpetas.map((carpeta, indexCarpeta) => {
                                                                                                    return <List key={indexCarpeta} component="div" disablePadding>

                                                                                                        <ListItem button onClick={() => { this.handleClick(indexCarpeta) }} className="pt-0 pb-0">
                                                                                                            <Grid container spacing={0}>
                                                                                                                <Grid item xs={4} className="d-flex align-self-center">
                                                                                                                    {carpeta.open ?  <ExpandMore className={classes.expand} /> : <ExpandLess className={classes.expand} />}
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
                                                                                                                    <Button color="primary" onClick={()=>{this.handleShowDialog(carpeta.Nombre, carpeta.Aclaraciones)}}>
                                                                                                                        <Translate id="languages.generalButton.masInfo"/>
                                                                                                                    </Button>
                                                                                                                </Grid>
                                                                                                            </Grid>
                                                                                                        </ListItem>
                                                                                                        <Collapse in={carpeta.open ? carpeta.open : false} timeout="auto" unmountOnExit>
                                                                                                            <List component="div" disablePadding>
                                                                                                                <ListItem className="pt-0 pb-0 pl-5" >
                                                                                                                    <List component="div" disablePadding style={{ width: '100%' }}>
                                                                                                                        {carpeta.children && carpeta.children.map((c, i) => {
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
                                                                                                                                        <Button color="primary" onClick={()=>{this.handleShowDialog(c.Nombre, c.Aclaraciones)}}>
                                                                                                                                            <Translate id="languages.generalButton.masInfo"/>
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
                                </Grid>
                                <Grid item xs={12} className="d-flex justify-content-between">
                                    <Button color="primary" size="small" className="px-4" onClick={() => { this.props.handleNavigation(true) }}>
                                        <Translate id="languages.generalButton.volver"/>
                                    </Button>
                                    <Button variant="contained" size="small" color="primary" className="px-3" onClick={()=> {this.handleCrearTrabajo()}}                                            >
                                        <Translate id="languages.generalButton.finalizar"/>
                                    </Button>

                                </Grid>

                            </Grid>
                            :
                            <CircularProgress />
                    }
                </Grid>
                <Grid item xs={12}>
                    <Dialog
                        open={this.state.dialogOpen}
                        onClose={this.handleCloseDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {this.state.dialogTitle}
                            </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <ReactQuill value={this.state.dialogContent} readOnly theme='bubble' />
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseDialog} color="primary" autoFocus>
                                <Translate id="languages.generalButton.aceptar"/>
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        );
    }

}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
    fetchErrorExpediente
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(CrearTrabajo))));