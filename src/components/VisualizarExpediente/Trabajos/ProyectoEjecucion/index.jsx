import React, {Component} from 'react';
import {
    Grid,
    Paper,
    CircularProgress,
    Typography,
    TextField,
    Button,
    ExpansionPanel,
    Checkbox,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    LinearProgress, withStyles, ListItem, List
} from '@material-ui/core';

import * as api from '../../../../api'
import CloudUpload from '@material-ui/icons/CloudUpload';
import CheckCircle from '@material-ui/icons/Check';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

import Close from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment'
import renderHTML from 'react-render-html';
import Dropzone from "react-dropzone";
import {fetchErrorExpediente, formatMenssage} from '../../../../actions/expedientes';
import connect from "react-redux/es/connect/connect";
import {Translate, withLocalize} from "react-localize-redux";
import {getDetallesArchivo} from "../../../../api";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import {red, green, orange} from '@material-ui/core/colors';
import {PanoramaFishEye, Lens} from '@material-ui/icons'

const styles = theme => ({
    root: {
        width: '100%',
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
    },
    buttonProgress: {

        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
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
    red: {
        color: red[500],

    },
    green: {
        color: green[500]
    },
    orange: {
        color: orange[500]
    },
    size: {
        fontSize: 12,
        marginTop: 6
    },
    textFieldInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        padding: '10px 12px',
        width: 'calc(100% - 24px)',
        '&:focus': {
            borderColor: theme.palette.primary.main,
        },
    },
    black: {
        fontWeight: 700
    }
});
const mapStateToProps = (state) => (
    {

    }
);

const mapDispatchToProps =
    {
        fetchErrorExpediente: fetchErrorExpediente,

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
            workDetails: false,
            aclaracionesOpen: false,
            uploadInProgress: false,
            uploadLength: 0,
            currentUpload: 0,
            itemSelected: [],
            currentUploadItem: false,
            pendingUploadList: [],
            fetchingRemove: 0,
            allowUpload:true,
            disableAutoAsignButton: true,
            detallesArchivo: null,
            loadingDetallesArchivo: false
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
                        let newList = [...b.state.pendingUploadList]
                        newList.splice(0, 1);
                        await b.setState({
                            currentUpload: i + 1,
                            currentUploadItem: item,
                            pendingUploadList: newList,
                        });
                        let response = this.props.estructura ? await api.uploadFile(b.state.expediente.Id_Expediente, b.props.trabajo, b.props.estructura.id, item) : await api.uploadFileToTemporalFolder(b.state.expediente.Id_Expediente, item);
                        if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                            this.props.fetchErrorExpediente(response);
                            this.abortUpload()
                        } else {

                            if (newList.length === 0) {
                                await b.setState({
                                    uploadInProgress: false
                                });
                                setTimeout(async ()=>{
                                    await this.loadInformation()
                                },1000)


                            }
                        }
                    } catch (e) {
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
        await this.loadGeneralInformation()
    }
    async loadGeneralInformation(){
        await this.setState({fetching: true})
        let expediente = this.props.expediente.Expediente[0];
        if (this.props.estructura) {
            let folderInfoResponse = await api.getFolderDetails(expediente.Id_Expediente, this.props.trabajo, this.props.estructura.id)
            let folderInfo = folderInfoResponse.data.Carpetas[0];

            await this.setState({ expediente,  folderInfo, allowUpload:folderInfo.Permite_Anexar_Archivos==='0'?false:true})
        } else {
            try {
                let workDetails = await api.getWorkDetails(expediente.Id_Expediente, this.props.trabajo);
                workDetails = workDetails.data;
                await this.setState({
                    expediente,
                    workDetails,
                })
            } catch (e) {
                this.props.fetchErrorExpediente(e);
            }
        }
        await this.loadInformation();
        await this.setState({fetching: false});
    }
    async loadInformation() {
        let expediente= this.state.expediente;
        await this.setState({fetchingCenter: true})
        if (this.props.estructura) {
            let response = await api.getFilesFromFolder(expediente.Id_Expediente, this.props.trabajo, this.props.estructura.id);
            let documentos = response.data.Archivos;
            let firmasDigitales = response.data.FirmasDigitales;
            await this.setState({fetchingCenter: false, data: documentos, firmasDigitales})
        } else {
            try {
                let response = await api.getAllFiles(expediente.Id_Expediente, this.props.trabajo);
                let temporalFiles = await api.getFilesFromTemporalFolder(expediente.Id_Expediente)
                temporalFiles = temporalFiles.Archivos;
                if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                    this.props.fetchErrorExpediente(response);
                }
                let documentos = response.Archivos
                let firmasDigitales = response.FirmasDigitales
                await this.setState({
                    fetchingCenter: false,
                    data: documentos,
                    firmasDigitales,
                    temporalFiles
                })
            } catch (e) {
                this.props.fetchErrorExpediente(formatMenssage(e.message));
            }
        }
    }

    expandPanel = (nombre, idEstructura) => async (event, expanded) => {
        this.setState({panelExpanded: expanded ? nombre : false, loadingDetallesArchivo: true});
        try {
            if(expanded){
            let response = await getDetallesArchivo(this.state.expediente.Id_Expediente,this.props.trabajo,idEstructura);
            if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                this.props.fetchErrorExpediente(response);
                this.setState({loadingDetallesArchivo: false});
            }
            else {
                this.setState({detallesArchivo: response, loadingDetallesArchivo: false});
            }
            }
        }
        catch (e) {
            this.props.fetchErrorExpediente(e.message);
            this.setState({loadingDetallesArchivo: false})

        }

    };

    handleChange = (name, index, arrName) => event => {
        let a = [];
        Object.assign(a, this.state[arrName]);
        a[index][name] = event.target.checked;
        this.setState({[arrName]: a, panelExpanded: -1});
        let {files, temporalFiles} = this.itemsToRemove();
        if (files.length || temporalFiles.length) {
            this.setState({showDeleteButton: true,showDownloadButton: true})
        } else {
            this.setState({showDeleteButton: false,showDownloadButton: false})
        }
        if(files.length===0 && temporalFiles.length>0)
        {
            this.setState({disableAutoAsignButton: false})
        } else {
            this.setState({disableAutoAsignButton: true})
        }
    };

    itemsToRemove() {
        let temporalFiles = this.state.temporalFiles?this.state.temporalFiles.filter((item) => item.checked):[]
        let files = this.state.data?this.state.data.filter((item) => item.checked):[]
        return {files, temporalFiles}
    }

    async handleRemove() {
        let {files, temporalFiles} = this.itemsToRemove();
        let count = 0;
        count+=files.length
        count+=temporalFiles.length
        if (count) {
            await this.setState({fetchingRemove:true})
            if(files.length){
                let arrayArchivos = [];
                files.map(item=>{
                    arrayArchivos.push({id_estructura:item.Id_Estructura})
                    return null
                });
                let response =  await api.removeMultipleFilesFromStructure(this.state.expediente.Id_Expediente,this.props.trabajo, arrayArchivos)
                if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                    this.props.fetchErrorExpediente(response);
                }
                let newData=[...this.state.data];
                files.map(item=>{
                     newData = newData.filter(current=>current.Id_Estructura!==item.Id_Estructura)
                    return null
                });

                await this.setState({data:newData})
            }
            if(temporalFiles.length){
                let arrayArchivos = [];
                temporalFiles.map(item=>{
                    arrayArchivos.push({Nombre:item.Nombre})
                    return null
                });
                let response =  await api.removeFilesFromTemporalFolder(this.state.expediente.Id_Expediente, arrayArchivos)
                if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                    this.props.fetchErrorExpediente(response);
                }
                let newData=[...this.state.temporalFiles];
                temporalFiles.map(item=>{
                    newData = newData.filter(current=>current.Nombre!==item.Nombre)
                    return null
                });

                await this.setState({temporalFiles:newData})
            }
            await this.setState({fetchingRemove:false})
            this.setState({showDeleteButton: false})
        }
    }
    download_file(fileURL, fileName) {
        // for non-IE
        if (!window.ActiveXObject) {
            var save = document.createElement('a');
            save.href = fileURL;
            save.target = '_blank';
            var filename = fileURL.substring(fileURL.lastIndexOf('/')+1);
            save.download = fileName || filename;
            if ( navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
                document.location = save.href;
// window event not working here
            }else{
                var evt = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': false
                });
                save.dispatchEvent(evt);
                (window.URL || window.webkitURL).revokeObjectURL(save.href);
            }
        }

        // for IE < 11
        else if ( !! window.ActiveXObject && document.execCommand)     {
            var _window = window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL)
            _window.close();
        }
    }

    async handleDownload() {
        let {files, temporalFiles} = this.itemsToRemove();
        let count = 0;
        count+=files.length
        count+=temporalFiles.length
        if (count) {
            await this.setState({fetchingDownload:0})
            if(files.length){

                files.map(async item=>{
                    await this.setState({fetchingDownload:this.state.fetchingDownload++})
                    let response =  await api.getUrlDownladOneFile(this.state.expediente.Id_Expediente,this.props.trabajo, item.Id_Estructura)
                    if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                        this.props.fetchErrorExpediente(response);
                    }

                    if(response.Archivos&&response.Archivos.length===1){
                        this.download_file(response.Archivos[0].Url,response.Archivos[0].Nombre);
                        let state_files =this.state.data
                        state_files.map(async (_item,_pos)=>{
                            if (_item.Id_Estructura===item.Id_Estructura)
                                await this.handleChange("checked", _pos, 'data')
                        })

                    }

                    await this.setState({fetchingDownload:this.state.fetchingDownload--})
                    return null
                });




            }
            // if(temporalFiles.length){
            //     let arrayArchivos = [];
            //     temporalFiles.map(item=>{
            //         arrayArchivos.push({Nombre:item.Nombre})
            //         return null
            //     });
            //     let response =  await api.removeFilesFromTemporalFolder(this.state.expediente.Id_Expediente, arrayArchivos)
            //     if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
            //         this.props.fetchErrorExpediente(response);
            //     }
            //     let newData=[...this.state.temporalFiles];
            //     temporalFiles.map(item=>{
            //         newData = newData.filter(current=>current.Nombre!==item.Nombre)
            //         return null
            //     });
            //
            //     await this.setState({temporalFiles:newData})
            // }


        }
    }
    async handleAutoAsign(){
        let {temporalFiles} = this.itemsToRemove();
        if(temporalFiles.length>0){
            try{
                await this.setState({fetchingAutoAsign:true})
                let files=[];
                temporalFiles.map(item=>{
                    files.push({
                        Nombre:item.Nombre
                    })
                    return null
                });
                let result = await api.autoAsignFilesFromTemporalFiles(this.state.expediente.Id_Expediente, this.props.trabajo, files)
                if(result.Archivos){
                    result.Archivos.map(item=>{
                        if(item.Insertado!==1){
                            this.props.fetchErrorExpediente(api.formatMenssage(`El documento ${item.Nombre} no fue insertado.`))

                        }else{
                            this.props.fetchErrorExpediente(api.formatMenssage(`El documento ${item.Nombre} fue insertado en la estructura ${item.Carpeta}`))
                        }
                        return null
                    })
                }else{
                    throw "Error procesando la petición"
                }
                await this.setState({fetchingAutoAsign:false})
                await this.loadInformation();
            }catch (e) {
                await this.setState({fetchingAutoAsign:false})
                //todo: Importar format Message para sacar una alerta
            }


        }
    }


    renderSize(size) {
        if (size < 1048576) {
            return (size / 1024).toFixed(2) + ' Kb'
        } else if (size < 1073741824) {
            return (size / 1024 / 1024) + ' Mb'
        } else {
            return (size / 1024 / 1024 / 1024) + ' Gb'
        }

    }

    render() {
        let {classes}=this.props
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
                                                    <Grid item xs={6} className="p-3">
                                                        <h6>{this.props.estructura ? 'Archivos de carpeta' : 'Archivos de trabajo'}</h6>
                                                    </Grid>
                                                    <Grid item xs={6} className="p-3 text-right">
                                                        {
                                                            this.state.uploadInProgress||!this.state.allowUpload ? null :
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
                                                <Grid container>
                                                    <Grid item xs={12} className="pr-3 text-right">

                                                        {
                                                            this.state.temporalFiles?
                                                                <div className={classes.wrapper} style={{float:'right'}}>
                                                                    <Button

                                                                        color="primary"
                                                                        onClick={() => {
                                                                            this.handleAutoAsign()
                                                                        }}
                                                                        disabled={this.state.disableAutoAsignButton ||this.state.fetchingAutoAsign>0}>
                                                                        Selección automática
                                                                    </Button>
                                                                    {this.state.fetchingAutoAsign>0 && <CircularProgress size={24}
                                                                                                                      className={classes.buttonProgress}/>}
                                                                </div>:null
                                                        }
                                                        <div className={classes.wrapper} style={{float:'right'}}>
                                                            <Button

                                                                color="primary"
                                                                onClick={() => {
                                                                    this.handleRemove()
                                                                }}
                                                                disabled={this.state.showDeleteButton !== true || this.state.fetchingRemove>0}>
                                                                Eliminar
                                                            </Button>
                                                            {this.state.fetchingRemove>0 && <CircularProgress size={24}
                                                                                                              className={classes.buttonProgress}/>}
                                                        </div>
                                                        <div className={classes.wrapper} style={{float:'right'}}>
                                                            <Button

                                                                color="primary"
                                                                onClick={() => {
                                                                    this.handleDownload()
                                                                }}
                                                                disabled={this.state.showDownloadButton !== true || this.state.fetchingDownload}>
                                                                Descargar
                                                            </Button>
                                                            {this.state.fetchingDownload? <CircularProgress size={24}
                                                                                                              className={classes.buttonProgress}/>:null}
                                                        </div>


                                                    </Grid>
                                                </Grid>
                                            </div>
                                        }
                                    </Paper>
                                    {this.state.fetchingCenter?
                                        <Paper>
                                            <Grid container spacing={24}>
                                                <Grid item xs={12} className='p-3 text-center'>
                                                    <CircularProgress/>
                                                </Grid>
                                            </Grid>

                                        </Paper>:
                                        <div>
                                            {
                                                (this.state.data && this.state.data.length > 0)|| (this.state.temporalFiles && this.state.temporalFiles.length > 0) ?
                                                    <div className="pl-2">
                                                        <Grid container spacing={16}>
                                                            <Grid item xs={6} className="p-3">
                                                                <Typography variant="subtitle2">
                                                                    NOMBRE DEL ARCHIVO
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={4} className="p-3">
                                                                <Typography variant="subtitle2">
                                                                    {this.props.estructura ? 'ÚLTIMA MODIFICACIÓN' : 'CARPETA'}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={2} className="p-3">
                                                                <Typography variant="subtitle2">
                                                                    FIRMA
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        {
                                                            this.state.temporalFiles && this.state.temporalFiles.map((item, pos) => {
                                                                return (<ExpansionPanel key={'temp-file-'+pos} draggable="true" onDragEnd={() => {
                                                                    this.props.dragging(false)
                                                                }} onDragStart={() => {
                                                                    this.props.dragging(item)
                                                                }} expanded={this.state.panelExpanded === item.Nombre}
                                                                                        onChange={this.expandPanel(item.Nombre, item.Id_Estructura)}>
                                                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                                        <Grid container spacing={16}>
                                                                            <Grid item xs={6} className='d-flex align-items-center'
                                                                            >
                                                                                <Checkbox
                                                                                    checked={item.checked ? item.checked : false}
                                                                                    onChange={this.handleChange("checked", pos, 'temporalFiles')}
                                                                                    value={item.Nombre}
                                                                                />
                                                                                <Typography className={classes.orange}>{item.Nombre}</Typography>
                                                                            </Grid>
                                                                            <Grid item xs={4} className="align-self-center">
                                                                                <Typography className={classes.orange}>
                                                                                    Sin Asignar
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={2} className="text-right align-self-center">
                                                                                <ErrorOutline className={classes.orange} size={24}/>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </ExpansionPanelSummary>
                                                                    <ExpansionPanelDetails>
                                                                        <Grid container spacing={16}>
                                                                            <Grid item xs={6} className="align-items-center">
                                                                                <Grid container spacing={0}>
                                                                                    <Grid item xs={12}>
                                                                                        <Typography variant="button" gutterBottom>
                                                                                            TAMAÑO DEL ARCHIVO
                                                                                        </Typography>
                                                                                    </Grid>

                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid item xs={4} className="align-self-center">
                                                                                <Grid container spacing={0}>
                                                                                    <Grid item xs={12}>
                                                                                        <Typography variant="button" gutterBottom>
                                                                                            {this.renderSize(item.Longitud)}
                                                                                        </Typography>
                                                                                    </Grid>

                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid item xs={2} className="align-self-center">
                                                                            </Grid>
                                                                        </Grid>

                                                                    </ExpansionPanelDetails>
                                                                </ExpansionPanel>)
                                                            })
                                                        }
                                                        {
                                                            this.state.data.map((item, pos) => {
                                                                return (<ExpansionPanel key={'file-'+pos}  expanded={this.state.panelExpanded === item.Archivo}
                                                                                        onChange={this.expandPanel(item.Archivo, item.Id_Estructura)}>
                                                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                                        <Grid container spacing={16}>
                                                                            <Grid item xs={6} className='d-flex align-items-center'>
                                                                                <Checkbox
                                                                                    checked={item.checked ? item.checked : false}
                                                                                    onChange={this.handleChange("checked", pos, 'data')}
                                                                                    value={item.Archivo}
                                                                                />
                                                                                <Typography className={item.Requisitos_Firma_Completos ? "" : classes.red}>
                                                                                    {item.Archivo}
                                                                                    </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={4} className="align-self-center">
                                                                                <Typography className={item.Requisitos_Firma_Completos ? "" : classes.red}>
                                                                                    {this.props.estructura ? '' : item.Carpeta}
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={2} className="text-right align-self-center">
                                                                                {item.Requisitos_Firma_Completos ?
                                                                                    <CheckCircle className={classes.green}/> :
                                                                                    <Close className={classes.red}/>
                                                                                }
                                                                            </Grid>
                                                                        </Grid>
                                                                    </ExpansionPanelSummary>
                                                                    <ExpansionPanelDetails>
                                                                        {this.state.loadingDetallesArchivo ? <CircularProgress/> :
                                                                            <Grid container spacing={16}>
                                                                                <Grid item xs={12}>
                                                                                    <Grid container spacing={0}>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography variant="button" gutterBottom>
                                                                                                TAMAÑO DEL ARCHIVO
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography  gutterBottom>
                                                                                                {this.state.detallesArchivo && this.state.detallesArchivo.Archivos && this.state.detallesArchivo.Archivos[0] ? this.renderSize(this.state.detallesArchivo.Archivos[0].Longitud) : ""}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <Grid item xs={12}>
                                                                                    <Grid container spacing={0}>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography variant="button" gutterBottom>
                                                                                                ULTIMA MODIFICACION
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography gutterBottom>
                                                                                                {this.state.detallesArchivo && this.state.detallesArchivo.Archivos && this.state.detallesArchivo.Archivos[0] ? this.state.detallesArchivo.Archivos[0].Fecha : ""}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <Grid item xs={12}>
                                                                                    <Grid container spacing={0}>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography variant="button" gutterBottom>
                                                                                                FIRMAS DEL ARCHIVO
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            <List>
                                                                                                {
                                                                                                    this.state.detallesArchivo&& this.state.detallesArchivo.FirmasDigitales &&  this.state.detallesArchivo.FirmasDigitales.length > 0 ?  this.state.detallesArchivo.FirmasDigitales.map((fd, pos) => {
                                                                                                            if (fd.Id_Archivo === item.Id_Archivo) {
                                                                                                                return (
                                                                                                                    <ListItem>
                                                                                                                        <ListItemText
                                                                                                                            primary={fd.Nombre}/>
                                                                                                                    </ListItem>)
                                                                                                            } else {
                                                                                                                return "";
                                                                                                            }
                                                                                                        }) :
                                                                                                        <ListItem>
                                                                                                            <ListItemText primary="--"/>
                                                                                                        </ListItem>
                                                                                                }
                                                                                            </List>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <Grid item xs={12}>
                                                                                    <Grid container spacing={0}>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography variant="button" gutterBottom>
                                                                                                FIRMAS REQUERIDAS
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography  gutterBottom>
                                                                                                {this.state.detallesArchivo && this.state.detallesArchivo.Archivos && this.state.detallesArchivo.Archivos[0] ? this.state.detallesArchivo.Archivos[0].Firmas_Requeridas : ""}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>

                                                                            </Grid>
                                                                        }

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
                                        <Grid container spacing={24}>
                                            <Grid item xs={12}>
                                                <Grid container spacing={0}>
                                                    <Grid item xs={6}>
                                                        <Typography variant='overline'>
                                                            TITULO COMPLEMENTARIO
                                                        </Typography>
                                                        <Typography variant='subtitle2'>
                                                            {this.state.workDetails.Trabajos[0].Titulo_Complementario ? this.state.workDetails.Trabajos[0].Titulo_Complementario : "-"}
                                                        </Typography>

                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant='overline'>
                                                            fecha de entrada
                                                        </Typography>
                                                        <Typography variant='subtitle2'>
                                                            {this.state.workDetails.Trabajos[0].Fecha_entrada ? moment(new Date(this.state.workDetails.Trabajos[0].Fecha_entrada)).format("DD/MM/YYYY") : "-"}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} style={{backgroundColor: "#fafafa"}}>
                                                <Grid container spacing={0}>
                                                    <Grid item xs={6}>
                                                        <Typography variant='overline'>
                                                            ESTADO
                                                        </Typography>
                                                        <Typography variant='subtitle2'>
                                                            {this.state.workDetails.Trabajos[0].Estado ? this.state.workDetails.Trabajos[0].Estado : "-"}
                                                        </Typography>

                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant='overline'>
                                                            FECHA DE VISADO
                                                        </Typography>
                                                        <Typography variant='subtitle2'>
                                                            {this.state.workDetails.Trabajos[0].Fecha_Tramitacion ? moment(new Date(this.state.workDetails.Trabajos[0].Fecha_Tramitacion)).format("DD/MM/YYYY") : "-"}
                                                            </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div className="d-flex">
                                                    <div className="pr-4">
                                                        <Typography variant='subtitle2' >
                                                            {this.state.workDetails.Trabajos[0].Tipo_Tramite}
                                                        </Typography>
                                                    </div>
                                                    <div className="d-flex px-2">
                                                        {this.state.workDetails.Trabajos[0].Es_Trabajo_Nuevo ? <Lens className={classes.size} color="primary"/> : <PanoramaFishEye className={classes.size} color="secondary"/>}

                                                        <Typography className={this.state.workDetails.Trabajos[0].Es_Trabajo_Nuevo ? classes.black : ""}
                                                            variant='subtitle2'>
                                                            Nuevo Trabajo
                                                        </Typography>
                                                    </div>
                                                    <div className="d-flex  px-2">
                                                        {this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Sustancial ? <Lens className={classes.size} color="primary"/> : <PanoramaFishEye className={classes.size} color="secondary"/>}
                                                        <Typography className={this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Sustancial ? classes.black : ""}
                                                            variant='subtitle2'>
                                                            Modificación Sustancial
                                                        </Typography>
                                                    </div>
                                                    <div className="d-flex px-2">
                                                        {this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Correcion_Basica ? <Lens className={classes.size} color="primary"/> : <PanoramaFishEye className={classes.size} color="secondary"/>}
                                                        <Typography className={this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Correcion_Basica ? classes.black : ""}
                                                            variant='subtitle2'>
                                                            Corrección Básica
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} style={{backgroundColor: "#fafafa"}}>
                                                <Grid container spacing={0}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            disabled
                                                            id="observations"
                                                            label={<Translate id="languages.expedients.fieldObservaciones"/>}
                                                            value={this.state.workDetails.Trabajos[0].Observaciones ? this.state.workDetails.Trabajos[0].Observaciones : '-'}
                                                            margin="normal"
                                                            multiline
                                                            rows={4}
                                                            helperText={"110/500"}
                                                            fullWidth
                                                            InputProps={{
                                                                disableUnderline: true,
                                                                classes: {
                                                                    input: classes.textFieldInput,
                                                                },
                                                            }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </Grid>

                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container spacing={0}>
                                                    <Grid item xs={6}>
                                                        <Typography variant='overline'>
                                                            Tipo de expediente
                                                        </Typography>
                                                        <Typography variant='subtitle2'>
                                                            {this.state.workDetails.Trabajos[0].Tipo_Grupo_tematico}/{this.state.workDetails.Trabajos[0].Tipo_Autorizacion_Municipal}
                                                        </Typography>

                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant='overline'>
                                                            Documentación de
                                                        </Typography>
                                                        <Typography variant='subtitle2'>
                                                            ???????
                                                            {/*{this.state.workDetails.Trabajos[0].Fecha_entrada?moment(new Date(this.state.workDetails.Trabajos[0].Fecha_entrada)).format("DD/MM/YYYY"):"-"}*/}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                : null
                        }
                        {
                            this.state.folderInfo ?
                                <Paper
                                    style={{borderColor: '#cecece', borderWidth: 1, marginTop: -7, marginBottom: 10}}>
                                    <div className="px-4 py-2">
                                        <Typography variant='button'>{this.state.folderInfo.Nombre}</Typography>
                                    </div>
                                    <div style={{backgroundColor: '#f5f5f5', marginTop: 10, marginBottom: 10}}>
                                        <Grid container spacing={24}>
                                          <Grid item xs={12} className="px-4">
                                              <Grid container spacing={16}>
                                                  <Grid item xs={6} className="p-3">
                                                      <label style={{textTransform: 'uppercase', fontSize: 12}}>Firmas
                                                          Requeridas</label><br/>
                                                      <b style={{
                                                          textTransform: 'uppercase',
                                                          fontSize: 12
                                                      }}>{this.state.folderInfo.Firmas_Requeridas}</b>
                                                  </Grid>
                                                  <Grid item xs={6} className="p-3">
                                                      <label style={{textTransform: 'uppercase', fontSize: 12}}>Fecha
                                                          entrada</label><br/>
                                                      <b style={{
                                                          textTransform: 'uppercase',
                                                          fontSize: 12
                                                      }}>{moment(new Date(this.state.expediente.Fecha_Entrada)).format("DD/MM/YYYY")}</b>
                                                  </Grid>
                                              </Grid>
                                          </Grid>
                                            <Grid item xs={12} className="px-4">
                                                <Grid container spacing={16}>
                                                    <Grid item xs={12} className="p-3">
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
                                            <Grid item xs={7} className="p-3">
                                                <label style={{fontSize: 12}}>Subiendo
                                                   Subido archivo {this.state.currentUpload} de {this.state.uploadLength}</label>
                                            </Grid>
                                            <Grid item xs={5} className="p-3"
                                                  style={{paddingRight: 10, paddingLeft: 0, textAlign: 'right'}}>
                                                <a onClick={() => this.abortUpload()} style={{
                                                    fontSize: 12,
                                                    textDecoration: 'underline',
                                                    color: '#2196f3'
                                                }}>Cancelar subida</a>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={5}>
                                            <Grid item xs={12} className="p-3">
                                                <LinearProgress style={{height: 20}} variant="determinate"
                                                                value={this.state.currentUpload * 100 / this.state.uploadLength}/>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={16}>
                                            <Grid item xs={12} className="p-3">
                                                <b style={{fontSize: 12}}>{this.state.currentUploadItem ? this.state.currentUploadItem.filename : null}</b>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={16}>
                                            <Grid item xs={12} className="p-3">
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

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(TrabajoEjecucion)));
