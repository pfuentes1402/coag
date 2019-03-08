import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { infoCarpetasTrabajo, getTiposTramite, addTrabajoEncomendaExpediente } from "../../api";
import { groupBy, filter } from 'lodash';
import {
    Grid, List, ListItem, ListSubheader,  Button, Typography, FormControl, MenuItem, Select, TextField,
    RadioGroup, FormControlLabel, Radio, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@material-ui/core";
import { Table, TableCell, TableHead, TableBody, TableRow, Divider } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/AddCircle';
import ExpandMore from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import { withRouter } from "react-router-dom";
import {fetchErrorExpediente, formatMenssage} from "../../actions/expedientes";
import { connect } from "react-redux";
import ReactQuill from "react-quill";
import {grey} from "@material-ui/core/colors/index";
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
        padding: 0
    },
    border: {
        borderLeft: "solid 1px" + theme.palette.secondary.light,
        borderRight: "solid 1px" + theme.palette.secondary.light,
        borderBottom: "solid 1px" + theme.palette.secondary.light,
    },
    headerProyect: {
        backgroundColor:  theme.palette.default,
        //borderBottom: "solid 1px" + theme.palette.secondary.light,
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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: "100%",
        textAlign: 'left',
        marginTop: 5
    },
    borderPrimary: {
        border: "1px solid " +theme.palette.primary.main,
    },
    borderSecondary: {
        border: "1px solid " + theme.palette.secondary.light,
    },
    borderBottomPrimary: {
        borderBottom: "1px solid " +theme.palette.primary.main,
    },
    borderBottomSecondary: {
        borderBottom: "1px solid " + theme.palette.secondary.light,
    },
    panelSumary: {
        margin: "8px 0 !important",
        minHeight: "26px !important"
    },
    uppercase: {
        textTransform: "uppercase"
    },
    expandIcon25: {
        top: "25%"
    },
    expandIcon50: {
        top: "50%"
    }
})
const CustomTableHead = withStyles(theme => ({
    head: {
        backgroundColor: grey[100],
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    }
}))(TableCell);
class CrearTrabajo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tiposTrabajos: this.props.trabajos,
            dataEncomenda: this.props.encomenda && this.props.encomenda.EncomendaActual && this.props.encomenda.EncomendaActual.length > 0
                ? this.props.encomenda.EncomendaActual[0] : null,
            tiposTramites: [],
            inforCarpetas: [],
            isCarpetas: false,
            expanded: null,
            dialogOpen: false,
            dialogTitle: "",
            dialogContent: "",
            loadingCrearTrabajo: false
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
          this.setState({loadingCrearTrabajo: true});
          try {
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

                  })

              });

              let data = {
                  "Trabajos": trabajos,
                  "IgnorarObservaciones":1
              }
              let response = await addTrabajoEncomendaExpediente(idExpediente, data);
              if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                  this.props.fetchErrorExpediente(response);
                  this.setState({loadingCrearTrabajo: false});
              }
              else {
                  this.setState({loadingCrearTrabajo: false});
                  this.props.history.push("/visualizar-expediente/" + idExpediente + "/" + response.Trabajos[0].Id_Trabajo);
              }
          }catch (e) {
              this.setState({loadingCrearTrabajo: false});
              this.props.fetchErrorExpediente(formatMenssage(e.message));
          }

     }

     handleShowDialog(title, content) {
         this.setState({dialogOpen: true, dialogTitle: title, dialogContent: content});
     }

    handleCloseDialog = () => {
        this.setState({ dialogOpen: false });
    };

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
                                <CustomTableHead className="text-uppercase px-1"/>
                            </TableRow>
                        </TableHead>

                        <TableBody className={classes.tableBodyHeight}>
                            {
                                this.props.encomenda.Colegiados.length === 0 ?
                                    <TableRow>
                                        <TableCell colSpan={4}/>
                                    </TableRow>
                                    : this.props.encomenda.Colegiados.map((row, index) => {
                                        return (
                                            <TableRow className={classes.row} key={index}>
                                                <TableCell component="th" scope="row" className="px-1 text-center">
                                                    {row.Nif}
                                                </TableCell>
                                                <TableCell className="pl-3">{row.Nombre}</TableCell>
                                                <TableCell className="px-2">{row.Porcentaje}</TableCell>
                                                <TableCell className="px-1 text-center">{row.Funcion}</TableCell>
                                                <TableCell className="px-1" style={{ width: 100 }}/>
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
                                this.props.encomenda.Promotores.length === 0 ?
                                    <TableRow>
                                        <TableCell colSpan={4}/>
                                    </TableRow>
                                    : this.props.encomenda.Promotores.map((row, index) => {
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

    handleCancel(){
        this.props.history.push("/visualizar-expediente/" + this.state.dataEncomenda.Id_Expediente);
    }

    render() {
        let { classes } = this.props;
        let { tiposTrabajos, tiposTramites, expanded } = this.state;
        return (
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Typography variant="h7" gutterBottom className="font-weight-bold">
                        <Translate id="languages.trabajo.datosEncargo" />
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField disabled={true}
                               value={this.state.dataEncomenda.Descripcion_Encomenda ? this.state.dataEncomenda.Descripcion_Encomenda : ""}
                               label={<Translate id="languages.crearTrabajo.labelExpedienteType" />}
                               className={`${classes.textField} my-3 text-uppercase mx-0 pl-0 pr-1`} />
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={6}>
                            {this.renderAgentsTable()}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {this.renderPromotorsTable()}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h7" gutterBottom className="py-3 font-weight-bold">
                        <Translate id="languages.trabajo.trabajoTramitarTitle" />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {
                        tiposTramites.length > 0 ?
                            <Grid container spacing={0} className={classes.border}>
                                <Grid item xs={12}>
                                    {Object.keys(tiposTrabajos).map((fase, indexFase) => {
                                        let trabajos = tiposTrabajos[fase];
                                        return <List key={indexFase}
                                                     subheader={<Typography variant="h7" gutterBottom className="py-2 pl-3 font-weight-bold">{fase}</Typography>}
                                            className={classes.root}
                                        >
                                            <ListItem className="p-0">
                                                <List
                                                    className={classes.root}>
                                                    {
                                                        trabajos.map((trabajo, indexTrabajo) => {
                                                            let idTipoTramite = this.getIdTipoTramite(trabajo.Obligatorio);
                                                            return <ListItem key={indexTrabajo} className={classes.item}>
                                                                <Grid container spacing={0}>
                                                                    <Grid item xs={12} className={`${classes.headerProyect} px-3`}>
                                                                        <div className="d-flex align-items-center justify-content-between">
                                                                            <Typography variant="button" gutterBottom className="mb-0">
                                                                                {trabajo.Trabajo_Titulo}
                                                                            </Typography>
                                                                            <FormControl className={classes.formControl}>
                                                                                <Select classes={{select: classes.uppercase}}
                                                                                    value={idTipoTramite}
                                                                                    displayEmpty
                                                                                    onChange={this.handleChange(fase, indexTrabajo, 'Id_Tipo_Tramite')}
                                                                                    inputProps={{
                                                                                        name: 'Id_Tipo_Tramite',
                                                                                        id: 'Id_Tipo_Tramite',
                                                                                    }}
                                                                                >

                                                                                    {tiposTramites.map(tramite => (
                                                                                        <MenuItem className="text-uppercase"
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
                                                                                                      control={<Radio color={ trabajo.defaultSelect === undefined || trabajo.defaultSelect === "Es_Trabajo_Nuevo" ? "primary" : "secondary"}/>}
                                                                                                      label={<Translate id="languages.trabajo.nuevoTrabajoTitle" />}
                                                                                                      className="m-0 text-uppercase font-weight-bold"
                                                                                                      />
                                                                                    <FormControlLabel
                                                                                        value="Es_Trabajo_Modificado_Sustancial"
                                                                                        control={<Radio color={ trabajo.defaultSelect &&  trabajo.defaultSelect === "Es_Trabajo_Modificado_Sustancial" ? "primary" : "secondary"}/>}
                                                                                        label={<Translate id="languages.trabajo.modificacionSustancialTitle" />}
                                                                                        className="m-0  text-uppercase font-weight-bold" />
                                                                                    <FormControlLabel
                                                                                        value="Es_Trabajo_Modificado_Correcion_Basica"
                                                                                        control={<Radio color={ trabajo.defaultSelect &&  trabajo.defaultSelect === "Es_Trabajo_Modificado_Correcion_Basica" ? "primary" : "secondary"}/>}
                                                                                        label={<Translate id="languages.trabajo.correccionBasicaTitle" />}
                                                                                       className="m-0  text-uppercase font-weight-bold" />
                                                                                </RadioGroup>
                                                                            </FormControl>
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item xs={12} >
                                                                        <ExpansionPanel className={`${expanded === trabajo.Id_Tipo_Trabajo ? classes.borderPrimary : classes.borderSecondary} shadow-none`} expanded={expanded === trabajo.Id_Tipo_Trabajo} onChange={this.handleChangePanel(trabajo.Id_Tipo_Trabajo, idTipoTramite, trabajo.defaultSelect ? trabajo.defaultSelect : "Es_Trabajo_Nuevo") }>
                                                                            <ExpansionPanelSummary classes={{expanded: classes.panelSumary, expandIcon: expanded === trabajo.Id_Tipo_Trabajo ? classes.expandIcon25 : classes.expandIcon50}} className={`${expanded === trabajo.Id_Tipo_Trabajo ? classes.borderBottomPrimary : classes.borderBottomSecondary} py-0 px-3`}  expandIcon={<ExpandMoreIcon color={expanded === trabajo.Id_Tipo_Trabajo ? "primary" : "secondary"}/>}>
                                                                                <Grid container spacing={0}>
                                                                                    <Grid item xs={4}>
                                                                                        <Typography variant="button" gutterBottom color={expanded === trabajo.Id_Tipo_Trabajo ? "primary" : "secondary"}>
                                                                                            <Translate id="languages.trabajo.previCarpetaTitle" />
                                                                                        </Typography>
                                                                                    </Grid>
                                                                                    <Grid item xs={4}>
                                                                                        <Typography variant="button" gutterBottom color={expanded === trabajo.Id_Tipo_Trabajo ? "primary" : "secondary"}>
                                                                                            Firmas requeridas
                                                                                        </Typography>
                                                                                    </Grid>
                                                                                    <Grid item xs={4}>
                                                                                        <Typography variant="button" gutterBottom color={expanded === trabajo.Id_Tipo_Trabajo ? "primary" : "secondary"}>
                                                                                            Aclaraciones
                                                                                        </Typography>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </ExpansionPanelSummary>
                                                                            <ExpansionPanelDetails>
                                                                                {this.state.isCarpetas ? <CircularProgress />
                                                                                    : <Grid container spacing={0}>
                                                                                        <Grid item xs={12} className="px-3">
                                                                                            <Grid container spacing={0}>
                                                                                                <Grid item xs={4}>
                                                                                                    <Typography variant="subtitle2" gutterBottom className="py-2">
                                                                                                        {trabajo.Trabajo_Titulo}
                                                                                                    </Typography>
                                                                                                </Grid>
                                                                                                <Grid item xs={4}>

                                                                                                </Grid>
                                                                                                <Grid item xs={4}>

                                                                                                </Grid>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                        <Grid item xs={12} style={{backgroundColor: "#fafafa"}} className="px-3">
                                                                                            {
                                                                                                this.state.inforCarpetas.map((carpeta, indexCarpeta) => {
                                                                                                    return <List key={indexCarpeta} component="div" disablePadding>

                                                                                                        <ListItem button onClick={() => { this.handleClick(indexCarpeta) }} className="pt-0 pb-0">
                                                                                                            <Grid container spacing={0}>
                                                                                                                <Grid item xs={4} className="d-flex align-self-center">
                                                                                                                    {carpeta.open ?  <ExpandMore color="primary" className={classes.expand} /> : <ExpandLess color="primary" className={classes.expand} />}
                                                                                                                    <Typography variant="subtitle2" gutterBottom>
                                                                                                                        {carpeta.Nombre + (carpeta.Archivo_Requerido && carpeta.Archivo_Requerido == 1 ? " *" : "")}
                                                                                                                    </Typography>

                                                                                                                </Grid>
                                                                                                                <Grid item xs={4} className="align-self-center">
                                                                                                                    <Typography variant="body1" gutterBottom>
                                                                                                                        {carpeta.Firmas_Requeridas ? carpeta.Firmas_Requeridas : "--"}
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
                                                                                                                                            {c.Nombre + (c.Archivo_Requerido && c.Archivo_Requerido == 1 ? " *" : "")}
                                                                                                                                        </Typography>
                                                                                                                                    </Grid>
                                                                                                                                    <Grid item xs={4}>
                                                                                                                                        <Typography variant="body1" gutterBottom>
                                                                                                                                            {c.Firmas_Requeridas ? c.Firmas_Requeridas : "--"}
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

                            </Grid>
                            :
                            <CircularProgress />
                    }
                </Grid>
                {tiposTramites.length > 0 ?
                    <Grid item xs={12} className="d-flex justify-content-between py-3">
                        <Button color="primary" size="small" disabled={this.state.loadingCrearTrabajo} className="px-4" onClick={() => { this.props.handleNavigation(true) }}>
                            <Translate id="languages.generalButton.volver"/>
                        </Button>
                        <div>
                            <Button color="primary" size="small" disabled={this.state.loadingCrearTrabajo} className="px-3" onClick={() => { this.handleCancel() }}>
                                <Translate id="languages.generalButton.cancel" /><Close />
                            </Button>
                            <Button variant="contained" size="small" color="primary" disabled={this.state.loadingCrearTrabajo} className="px-3" onClick={()=> {this.handleCrearTrabajo()}}                                            >
                                <Translate id="languages.generalButton.finalizar"/>
                                <CheckIcon/>
                            </Button>
                            {this.state.loadingCrearTrabajo ? <CircularProgress size={24}/> : ""}
                        </div>
                    </Grid>
                    : ""
                }

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