import React, {Component} from 'react';
import {
    Grid,
    Paper,
    CircularProgress,
    Typography,
    Toolbar,
    TextField,
    Button,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    LinearProgress, withStyles, ListItem, List
} from '@material-ui/core';
import UploadFile from './uploadFile';
import * as api from '../../../../api'
import CloudUpload from '@material-ui/icons/CloudUpload';
import CheckCircle from '@material-ui/icons/CheckCircle';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Close from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment'
import renderHTML from 'react-render-html';
import Dropzone from "react-dropzone";
import { fetchErrorExpediente, formatMenssage } from '../../../../actions/expedientes';
import connect from "react-redux/es/connect/connect";
import {withLocalize} from "react-localize-redux";
import {getValidateAddress} from "../../../../api";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
const styles = theme => ({
    root: {
        width: '100%',
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
});
const mapStateToProps = (state) => (
    {

    }
);

const mapDispatchToProps =
    {
        fetchErrorExpediente: fetchErrorExpediente
    };

class TrabajoEjecucion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: true,
            error: false,
            data: [],
            firmasDigitales: [],
            panelExpanded: false,
            folderInfo: false,
            expediente: false,
            workDetails:false,
            aclaracionesOpen: false,
            uploadInProgress: false,
            uploadLength: 0,
            currentUpload: 0,
            currentUploadItem: false,
            pendingUploadList: [],


        }
    }

    async onDrop(acceptedFiles) {
        let files = []
        acceptedFiles.forEach(file => {
            files.push({
                filename: file.name,
                data: file
            })
        });
        if (files.length === 0)
            return null;
        await this.setState({
            uploadInProgress: true,
            pendingUploadList: files,
            uploadLength: files.length
        });
        let b = this;
        for (let i = 0, p = Promise.resolve(); i < files.length; i++) {
            let item = files[i];
            p = p.then(_ => new Promise(async resolve => {

                    try {

                        let response =this.props.estructura?  await api.uploadFile(b.state.expediente.Id_Expediente, b.props.trabajo, b.props.estructura.id, item):await api.uploadFileToTemporalFolder(b.state.expediente.Id_Expediente, item);
                        if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                            this.props.fetchErrorExpediente(response);
                            this.abortUpload()
                        }
                        else {
                            let newList = [...b.state.pendingUploadList]
                            newList.splice(0, 1);
                            await b.setState({
                                currentUpload: i + 1,
                                currentUploadItem: item,
                                pendingUploadList: newList,
                            });
                            if (newList.length === 0) {
                                await b.setState({
                                    uploadInProgress: false
                                });
                                await this.loadInformation()

                            }
                        }
                    }
                    catch (e) {
                        this.props.fetchErrorExpediente(formatMenssage(e.message));
                       this.abortUpload()
                    }

                    resolve()

                }
            ));
        }


    }


    abortUpload() {
        this.setState({
            uploadInProgress: false,
            uploadLength: 0,
            currentUpload: 0,
            currentUploadItem: false,
            pendingUploadList: [],
        })
    }

    async componentDidMount() {
        await this.loadInformation()
    }
    async loadInformation(){
        await this.setState({fetching:true})
        let expediente = this.props.expediente.Expediente[0]
        console.log('trabajo', this.props.trabajo,expediente)
        if (this.props.estructura) {
            let response = await api.getFilesFromFolder(expediente.Id_Expediente, this.props.trabajo, this.props.estructura.id)
            let documentos = response.data.Archivos
            let firmasDigitales = response.data.FirmasDigitales
            let folderInfoResponse = await api.getFolderDetails(expediente.Id_Expediente, this.props.trabajo, this.props.estructura.id)

            let folderInfo = folderInfoResponse.data.Carpetas[0]
            await this.setState({fetching: false, expediente, data: documentos, folderInfo, firmasDigitales})
        } else {
            try{
                let response = await api.getAllFiles(expediente.Id_Expediente, this.props.trabajo);
                let temporalFiles = await api.getFilesFromTemporalFolder(expediente.Id_Expediente)
                temporalFiles=temporalFiles.Archivos
                let workDetails =  await api.getWorkDetails(expediente.Id_Expediente,this.props.trabajo);
                workDetails=workDetails.data;
                if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                    this.props.fetchErrorExpediente(response);
                }
                let documentos = response.Archivos
                let firmasDigitales = response.FirmasDigitales
                await this.setState({fetching: false, expediente, data: documentos, firmasDigitales,workDetails,temporalFiles})
            }catch (e) {

            }


        }
    }

    expandPanel(id = false) {
        if (this.state.panelExpanded === id) {
            this.setState({panelExpanded: false})
        } else {
            this.setState({panelExpanded: id})
        }

    }
    renderSize(size){
        if(size<1048576){
            return   (size/1024).toFixed(2)+' Kb'
        }
        else if (size<1073741824){
             return (size/1024/1024)+' Mb'
        }else{
            return (size/1024/1024/1024)+' Gb'
        }

    }

    render() {
        return (
            <div style={{minHeight: 800}} className="m-2">
                <Grid container spacing={16}>
                    <Grid item md={6} xs={12} className="p-3">
                        {
                            this.state.fetching ?
                                <div className="text-center">
                                    <CircularProgress/>
                                </div>
                                : <div>
                                    <Paper style={{paddingLeft: 10}}>
                                        {
                                            <div>
                                                <Grid container spacing={16}>
                                                    <Grid item xs={6} className="p-3"><h6>{this.props.estructura?'Archivos de carpeta':'Archivos de trabajo'}</h6></Grid>
                                                    <Grid item xs={6} className="p-3 text-right">
                                                        {
                                                            this.state.uploadInProgress ? null :
                                                                <Dropzone style={{
                                                                    width: 'auto',
                                                                    height: 'auto',
                                                                    borderStyle: 'none'
                                                                }}
                                                                          accept="application/pdf"
                                                                          onDrop={(acceptedFiles) => this.onDrop(acceptedFiles)}>
                                                                    <Button color="primary">
                                                                        Añadir archivos <CloudUpload
                                                                        style={{marginLeft: 5}}/>
                                                                    </Button>
                                                                </Dropzone>
                                                        }


                                                    </Grid>
                                                </Grid>
                                            </div>
                                        }
                                    </Paper>
                                    {
                                        this.state.data.length > 0 ?
                                            <div className="pl-2">
                                                <Grid container spacing={16}>
                                                    <Grid xs={6} className="p-3">
                                                        <Typography variant="subtitle2">
                                                            NOMBRE DEL ARCHIVO
                                                        </Typography>
                                                    </Grid>
                                                    <Grid xs={4} className="p-3">
                                                        <Typography variant="subtitle2">
                                                            {this.props.estructura?'ÚLTIMA MODIFICACIÓN':'CARPETA'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid xs={2} className="p-3">
                                                        <Typography variant="subtitle2">
                                                            FIRMA
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                {
                                                    this.state.data.map((item, pos) => {
                                                        return (<ExpansionPanel expanded={this.state.panelExpanded === pos}
                                                                                onChange={() => this.expandPanel(pos)}>
                                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                                <Grid container spacing={16}>
                                                                    <Grid xs={6}
                                                                          ><Typography style={{color:item.Requisitos_Firma_Completos ?'#1b5e20':'#b71c1c'}}>{item.Archivo}</Typography></Grid>
                                                                    <Grid xs={4}
                                                                          ><Typography style={{color:item.Requisitos_Firma_Completos ?'#1b5e20':'#b71c1c'}}>{this.props.estructura?'':item.Carpeta}</Typography></Grid>
                                                                    <Grid xs={2} className="text-right">
                                                                        {item.Requisitos_Firma_Completos ?
                                                                        <CheckCircle/> :
                                                                        <Close style={{color: 'red'}}/>
                                                                        }
                                                                    </Grid>
                                                                </Grid>
                                                            </ExpansionPanelSummary>
                                                            <ExpansionPanelDetails>
                                                                <Grid container spacing={16}>
                                                                    <Grid xs={6}>
                                                                        <Grid container spacing={0}>
                                                                            <Grid xs={12}>
                                                                                <Typography variant="button" gutterBottom>
                                                                                    TAMAÑO DEL ARCHIVO
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid xs={12}>
                                                                                <Typography variant="button" gutterBottom>
                                                                                    FIRMAS DEL ARCHIVO
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid xs={12}>
                                                                                <Typography variant="button" gutterBottom>
                                                                                    FIRMAS REQUERIDAS
                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid xs={4}>
                                                                        <Grid container spacing={0}>
                                                                            <Grid xs={12}>
                                                                                <Typography variant="button" gutterBottom>
                                                                                   ?????
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid xs={12}>
                                                                                <List>
                                                                                    {
                                                                                        this.state.firmasDigitales. length > 0 ? this.state.firmasDigitales.map((fd, pos) => {
                                                                                            if (fd.Id_Archivo == item.Id_Archivo) {
                                                                                                return (
                                                                                                    <ListItem >
                                                                                                        <ListItemText primary={fd.Nombre}/>
                                                                                                    </ListItem>)
                                                                                            } else {
                                                                                                return "";
                                                                                            }
                                                                                        }) :
                                                                                            <ListItem >
                                                                                                <ListItemText primary="--"/>
                                                                                            </ListItem>
                                                                                    }
                                                                                </List>
                                                                            </Grid>
                                                                            <Grid xs={12}>
                                                                                <Typography variant="button" gutterBottom>
                                                                                    ???????
                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid xs={2}>
                                                                    </Grid>
                                                                </Grid>

                                                            </ExpansionPanelDetails>
                                                        </ExpansionPanel>)
                                                    })
                                                }
                                                {
                                                    this.state.temporalFiles&& this.state.temporalFiles.map((item, pos) => {
                                                        return (<ExpansionPanel expanded={this.state.panelExpanded === 't-'+pos}
                                                                                onChange={() => this.expandPanel('t-'+pos)}>
                                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                                <Grid container spacing={16}>
                                                                    <Grid xs={6}
                                                                    ><Typography style={{color:'#b26a00'}}>{item.Nombre}</Typography></Grid>
                                                                    <Grid xs={4}
                                                                    ><Typography style={{color:'#b26a00'}}>Sin Asignar</Typography></Grid>
                                                                    <Grid xs={2} className="text-right">
                                                                            <ErrorOutline style={{color:'#b26a00'}} size={24}/>
                                                                    </Grid>
                                                                </Grid>
                                                            </ExpansionPanelSummary>
                                                            <ExpansionPanelDetails>
                                                                <Grid container spacing={16}>
                                                                    <Grid xs={6}>
                                                                        <Grid container spacing={0}>
                                                                            <Grid xs={12}>
                                                                                <Typography variant="button" gutterBottom>
                                                                                    TAMAÑO DEL ARCHIVO
                                                                                </Typography>
                                                                            </Grid>

                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid xs={4}>
                                                                        <Grid container spacing={0}>
                                                                            <Grid xs={12}>
                                                                                <Typography variant="button" gutterBottom>
                                                                                    {this.renderSize(item.Longitud)}
                                                                                </Typography>
                                                                            </Grid>

                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid xs={2}>
                                                                    </Grid>
                                                                </Grid>

                                                            </ExpansionPanelDetails>
                                                        </ExpansionPanel>)
                                                    })
                                                }
                                            </div>
                                            :
                                            <h1 className="text-center" style={{color: '#cecece', marginTop: 15}}>No hay
                                                resultados que mostrar</h1>
                                    }
                                </div>
                        }
                    </Grid>
                    <Grid item md={6} xs={12} className="p-3">
                        {
                            this.state.workDetails ?
                                <ExpansionPanel expanded={this.state.fichaTrabajoOpen}
                                                onChange={() => this.setState({fichaTrabajoOpen: !this.state.fichaTrabajoOpen})}>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                        <Typography variant='button'>ficha del trabajo</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <div style={{width: '100%'}}>
                                            <Grid container spacing={4}>
                                                <Grid xs={6} >
                                                    <Typography variant='overline'>
                                                        TITULO COMPLEMENTARIO
                                                    </Typography>
                                                    <Typography variant='subtitle2'>
                                                        {this.state.workDetails.Trabajos[0].Titulo_Complementario?this.state.workDetails.Trabajos[0].Titulo_Complementario:"-"}
                                                    </Typography>

                                                </Grid>
                                                <Grid xs={6} className="pl-1">
                                                    <Typography variant='overline'>
                                                        fecha de entrada
                                                    </Typography>
                                                    <Typography variant='subtitle2'>
                                                        {this.state.workDetails.Trabajos[0].Fecha_entrada?moment(new Date(this.state.workDetails.Trabajos[0].Fecha_entrada)).format("DD/MM/YYYY"):"-"}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={4}>
                                                <Grid xs={6} >
                                                    <Typography variant='overline'>
                                                        ESTADO
                                                    </Typography>
                                                    <Typography variant='subtitle2'>
                                                        {this.state.workDetails.Trabajos[0].Estado?this.state.workDetails.Trabajos[0].Estado:"-"}
                                                    </Typography>

                                                </Grid>
                                                <Grid xs={6} className="pl-1">
                                                    <Typography variant='overline'>
                                                        FECHA DE VISADO
                                                    </Typography>
                                                    <Typography variant='subtitle2'>
                                                        ???????
                                                        {/*{this.state.workDetails.Trabajos[0].Fecha_entrada?moment(new Date(this.state.workDetails.Trabajos[0].Fecha_entrada)).format("DD/MM/YYYY"):"-"}*/}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={4}>
                                                <Grid xs={4} >
                                                    <Typography variant='subtitle2'>
                                                        {this.state.workDetails.Trabajos[0].Tipo_Tramite}
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={2} className="pl-1">
                                                    <Typography variant='subtitle2' style={{fontWeight:this.state.workDetails.Trabajos[0].Es_Trabajo_Nuevo?'bold':'none'}}>
                                                        Nuevo Trabajo
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3} className="pl-1">
                                                    <Typography variant='subtitle2' style={{fontWeight:this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Sustancial?'bold':'none'}}>
                                                        Modificación Sustancial
                                                    </Typography>
                                                </Grid>
                                                <Grid xs={3} className="pl-1">
                                                    <Typography variant='subtitle2' style={{fontWeight:this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Correcion_Basica?'bold':'none'}}>
                                                        Corrección Básica
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={4}>
                                                <Grid xs={12} >
                                                    <Typography variant='overline'>
                                                        Observaciones
                                                    </Typography>
                                                    <Typography variant='subtitle2'>
                                                        {this.state.workDetails.Trabajos[0].Observaciones?this.state.workDetails.Trabajos[0].Observaciones:'-'}
                                                    </Typography>

                                                </Grid>

                                            </Grid>
                                            <Grid container spacing={4}>
                                                <Grid xs={6} >
                                                    <Typography variant='overline'>
                                                        Tipo de expediente
                                                    </Typography>
                                                    <Typography variant='subtitle2'>
                                                        {this.state.workDetails.Trabajos[0].Tipo_Grupo_tematico}/{this.state.workDetails.Trabajos[0].Tipo_Autorizacion_Municipal}
                                                    </Typography>

                                                </Grid>
                                                <Grid xs={6} className="pl-1">
                                                    <Typography variant='overline'>
                                                        Documentación de
                                                    </Typography>
                                                    <Typography variant='subtitle2'>
                                                        ???????
                                                        {/*{this.state.workDetails.Trabajos[0].Fecha_entrada?moment(new Date(this.state.workDetails.Trabajos[0].Fecha_entrada)).format("DD/MM/YYYY"):"-"}*/}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                : null
                        }
                        {
                            this.state.folderInfo ?
                                <Paper
                                    style={{borderColor: '#cecece', borderWidth: 1, marginTop: -7, marginBottom: 10}}>
                                    <div style={{padding: 6}}>
                                        <b style={{fontSize: 12}}>{this.state.folderInfo.Nombre}</b>
                                    </div>
                                    <div style={{backgroundColor: '#f5f5f5', marginTop: 10, marginBottom: 10}}>
                                        <Grid container spacing={16}>
                                            <Grid xs={6} className="p-3">
                                                <label style={{textTransform: 'uppercase', fontSize: 12}}>Firmas
                                                    Requeridas</label><br/>
                                                <b style={{
                                                    textTransform: 'uppercase',
                                                    fontSize: 12
                                                }}>{this.state.folderInfo.Firmas_Requeridas}</b>
                                            </Grid>
                                            <Grid xs={6} className="p-3">
                                                <label style={{textTransform: 'uppercase', fontSize: 12}}>Fecha
                                                    entrada</label><br/>
                                                <b style={{
                                                    textTransform: 'uppercase',
                                                    fontSize: 12
                                                }}>{moment(new Date(this.state.expediente.Fecha_Entrada)).format("DD/MM/YYYY")}</b>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={16}>
                                            <Grid xs={12} className="p-3">
                                                <ExpansionPanel expanded={this.state.aclaracionesOpen}
                                                                onChange={() => this.setState({aclaracionesOpen: !this.state.aclaracionesOpen})}>
                                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                        {this.state.aclaracionesOpen ? "Ocultar aclaraciones de contenido" : "Mostrar aclaraciones de contenido"}
                                                    </ExpansionPanelSummary>
                                                    <ExpansionPanelDetails>
                                                        <div style={{width: '100%'}}>
                                                            <span>
                                                              {renderHTML(this.state.folderInfo.Aclaraciones)}
                                                            </span>
                                                        </div>
                                                    </ExpansionPanelDetails>
                                                </ExpansionPanel>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Paper>
                                : null
                        }
                        {
                            this.state.uploadInProgress ?
                                <div style={{marginTop: 20}}>
                                    <Paper>
                                        <Grid container spacing={16}>
                                            <Grid xs={7} className="p-3">
                                                <label style={{fontSize: 12}}>Subiendo
                                                    archivo {this.state.currentUpload} de {this.state.uploadLength}</label>
                                            </Grid>
                                            <Grid xs={5} className="p-3"
                                                  style={{paddingRight: 10, paddingLeft: 0, textAlign: 'right'}}>
                                                <a onClick={() => this.abortUpload()} style={{
                                                    fontSize: 12,
                                                    textDecoration: 'underline',
                                                    color: '#2196f3'
                                                }}>Cancelar subida</a>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={5}>
                                            <Grid xs={12} className="p-3">
                                                <LinearProgress style={{height: 20}} variant="determinate"
                                                                value={this.state.currentUpload * 100 / this.state.uploadLength}/>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={16}>
                                            <Grid xs={12} className="p-3">
                                                <b style={{fontSize: 12}}>{this.state.currentUploadItem ? this.state.currentUploadItem.filename : null}</b>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={16}>
                                            <Grid xs={12} className="p-3">
                                                <ul style={{listStyle: 'none', overflowX: 'hidden'}}>
                                                    {
                                                        this.state.pendingUploadList.map((item, pos) => {

                                                            return (<li>{item.filename}</li>)
                                                        })
                                                    }
                                                </ul>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </div> : null
                        }

                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(TrabajoEjecucion));
