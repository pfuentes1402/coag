import React, { Component } from 'react';
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
    LinearProgress, withStyles,
    ListItem, List, ListItemText, FormControl,
    Select, MenuItem, FormControlLabel, RadioGroup, Radio, Tooltip,
    Divider
} from '@material-ui/core';


import * as api from '../../../../api'
import CloudUpload from '@material-ui/icons/CloudUpload';
import CheckCircle from '@material-ui/icons/Check';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment'
import renderHTML from 'react-render-html';
import Dropzone from "react-dropzone";
import * as actionsExpedientes from '../../../../actions/expedientes';

import { connect } from "react-redux";
import { Translate, withLocalize } from "react-localize-redux";
import { getDetallesArchivo } from "../../../../api";
import { red, green, orange } from '@material-ui/core/colors';
import { PanoramaFishEye, Lens, PictureAsPdf } from '@material-ui/icons'
import { getTiposTramite, putFichaTrabajo } from "../../../../api";
import '../../../Tramitaciones/estados.css';
import { formatMenssage } from "../../../../actions/expedientes";
import TemporalFolder from './TemporalFolder'
//import { Divider } from 'material-ui';

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
        color: orange[500],
        overflow: 'hidden',
        marginRight: '5%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    size: {
        fontSize: 12,
        marginTop: 6
    },
    formControl: {
        width: "100%"
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: "100%",
        textAlign: 'left',
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
    link: {
        color: theme.palette.primary.main,
        cursor: "pointer"
    },
    black: {
        fontWeight: 700
    },
    margin: {
        margin: 0
    },
    backgroundColor: {
        backgroundColor: "#f5f5f5"
    },
    rootPanel: {
        position: "inherit"
    },
    helperText: {
        textAlign: "end",
        fontWeight: "bold"
    },
    disabledContainer: {
        pointerEvents: "none",
        opacity: 0.4
    }
});
const mapStateToProps = (state) => {
    return (
        {
            fileUpload: state.status.files
        }
    )
};

const mapDispatchToProps =
{
    fetchErrorExpediente: actionsExpedientes.fetchErrorExpediente,
    uploadFiles: actionsExpedientes.uploadFiles,
    resetUploadStates: actionsExpedientes.resetUpladStates,
    showUploadComponent: actionsExpedientes.showUploadComponent,
    hideUploadComponent: actionsExpedientes.hideUploadComponent,
    formatMessage: actionsExpedientes.formatMenssage,
    dispatchSetFetchingDone: actionsExpedientes.dispatchSetFetchingDone
};

class FilesInFolder extends Component {
    componentWillReceiveProps(nextProps, nextContext) {
        this.reloadAfther1Second()
    }
    componentWillUnmount() {
        this.props.showUploadComponent()
    }

    async reloadAfther1Second() {
        await setTimeout(() => {
            if (this.props.fileUpload.fetchingDone&&this.props.fileUpload.typeUpload=='toEstructura') {
                this.loadInformation()
                this.props.dispatchSetFetchingDone();
                this.props.refreshTree();
                this.setState({isMyRequest:false})
;
            }
        }, 500)
    }

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
            checkAll: false,
            currentUploadItem: false,
            pendingUploadList: [],
            fetchingRemove: 0,
            allowUpload: true,
            disableAutoAsignButton: true,
            detallesArchivo: null,
            loadingDetallesArchivo: false,
            tiposTramites: [],
            loadingUpdateFichaTrabajo: false,
            temporalFiles: [],
            administrativeNotivficationSave: null
        }
    }
    async onDrop(acceptedFiles) {
        let expediente = this.props.expediente.Expediente[0];
        await this.props.uploadFiles(acceptedFiles, true, expediente, this.props.trabajo, this.props.estructura)

        await this.setState({
            uploadInProgress: true,
            isMyRequest:true,
        })

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
        this.props.hideUploadComponent()
    }
    async componentWillMount() {
        this.props.showUploadComponent()
        await this.loadGeneralInformation();
        await this.getTiposTramites();
    }
    async getTiposTramites() {
        let response = await getTiposTramite(this.props.activeLanguage.code);
        if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
            this.props.fetchErrorExpediente(response);
        }
        else {
            let tiposTramites = response.Tipos_Trabajos_Tramites;
            this.setState({ tiposTramites: tiposTramites });
        }
    }
    async loadGeneralInformation() {
        await this.setState({ fetching: true })
        let expediente = this.props.expediente.Expediente[0];

        await this.setState({ expediente })
        await this.loadInformation();
        await this.setState({ fetching: false });
    }
    async loadInformation() {
        let expediente = this.props.expediente.Expediente[0];
        await this.setState({ fetchingCenter: true })
        if (this.props.estructura) {
            let response = await api.getFilesFromFolder(expediente.Id_Expediente, this.props.trabajo, this.props.estructura.id);
            let documentos = response.data.Archivos;
            let firmasDigitales = response.data.FirmasDigitales;
            await this.setState({ fetchingCenter: false, data: documentos, firmasDigitales })
        }else{
            let r = await api.getAllFiles(expediente.Id_Expediente, this.props.trabajo);
            let documentos = r.Archivos;
            let firmasDigitales = r.FirmasDigitales;
            await this.setState({ fetchingCenter: false, data: documentos, firmasDigitales })
        }
    }

    expandPanel = (nombre, idEstructura) => async (event, expanded) => {
        this.setState({ panelExpanded: expanded ? (idEstructura ? idEstructura : nombre) : false, loadingDetallesArchivo: true });
        try {
            if (expanded && idEstructura) {
                let response = await getDetallesArchivo(this.state.expediente.Id_Expediente, this.props.trabajo, idEstructura);
                if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                    this.props.fetchErrorExpediente(response);
                    this.setState({ loadingDetallesArchivo: false });
                }
                else {
                    this.setState({ detallesArchivo: response, loadingDetallesArchivo: false });
                }
            }
        }
        catch (e) {
            this.props.fetchErrorExpediente(e.message);
            this.setState({ loadingDetallesArchivo: false })

        }

    };
    handleCheckAll = () => async event => {

        let tf = [...this.state.temporalFiles];

        tf.map(item => {
            item.checked = event.target.checked;
        });
        let data = [...this.state.data];
        data.map(item => {
            item.checked = event.target.checked;
        });
        await this.setState({ temporalFiles: tf, data, checkAll: event.target.checked });
        let { files, temporalFiles } = this.itemsToRemove();
        if (files.length || temporalFiles.length) {
            this.setState({ showDeleteButton: true, showDownloadButton: true })
        } else {
            this.setState({ showDeleteButton: false, showDownloadButton: false })
        }
        if (files.length === 0 && temporalFiles.length > 0) {
            this.setState({ disableAutoAsignButton: false })
        } else {
            this.setState({ disableAutoAsignButton: true })
        }


    }
    handleChange = (name, index, arrName) => async event => {
        let a = [];
        Object.assign(a, this.state[arrName]);
        a[index][name] = event.target.checked;
        await this.setState({ [arrName]: a, panelExpanded: -1 });
        let bind = this
        let { files, temporalFiles } = this.itemsToRemove();
        if (files.length || temporalFiles.length) {
            this.setState({ showDeleteButton: true, showDownloadButton: true })
        } else {
            this.setState({ showDeleteButton: false, showDownloadButton: false })
        }
        if (files.length === 0 && temporalFiles.length > 0) {
            this.setState({ disableAutoAsignButton: false })
        } else {
            this.setState({ disableAutoAsignButton: true })
        }
        if (files.length === this.state.data.length && temporalFiles.length === this.state.temporalFiles.length)
            this.setState({ checkAll: true })
        else
            this.setState({ checkAll: false })
    };

    itemsToRemove() {
        let temporalFiles = this.state.temporalFiles ? this.state.temporalFiles.filter((item) => item.checked) : []
        let files = this.state.data ? this.state.data.filter((item) => item.checked) : []
        return { files, temporalFiles }
    }

    getSelectedItems() {
        let temporalFiles = this.state.temporalFiles ? this.state.temporalFiles.filter((item) => item.checked) : []
        let files = this.state.data ? this.state.data.filter((item) => item.checked) : []
        return files.concat(temporalFiles);
    }

    async handleRemove() {
        let { files, temporalFiles } = this.itemsToRemove();
        let count = 0;
        count += files.length
        count += temporalFiles.length
        if (count) {
            await this.setState({ fetchingRemove: true, showDownloadButton: false })
            if (files.length) {
                let arrayArchivos = [];
                files.map(item => {
                    arrayArchivos.push({ id_estructura: item.Id_Estructura })
                    return null
                });
                let response = await api.removeMultipleFilesFromStructure(this.state.expediente.Id_Expediente, this.props.trabajo, arrayArchivos)
                if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                    this.props.fetchErrorExpediente(response);
                } else {
                    let newData = [...this.state.data];
                    files.map(item => {
                        newData = newData.filter(current => current.Id_Estructura !== item.Id_Estructura)
                        return null
                    });

                    await this.setState({ data: newData })
                }

            }

            await this.setState({ fetchingRemove: false, showDeleteButton: false, showDownloadButton: false })
        }
        this.props.refreshTree()
    }
    download_file(fileURL, fileName) {
        // for non-IE
        if (!window.ActiveXObject) {
            var save = document.createElement('a');
            save.href = fileURL;
            save.target = '_blank';
            var filename = fileURL.substring(fileURL.lastIndexOf('/') + 1);
            save.download = fileName || filename;
            if (navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
                document.location = save.href;
                // window event not working here
            } else {
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
        else if (!!window.ActiveXObject && document.execCommand) {
            var _window = window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL)
            _window.close();
        }
    }

    async handleDownload() {
        let { files, temporalFiles } = this.itemsToRemove();
        let count = 0;
        count += files.length
        count += temporalFiles.length
        if (count) {


            await this.setState({ fetchingDownload: 0 })
            if (files.length) {
                if (files.length === 1) {
                    let item = files[0];
                    await this.setState({ fetchingDownload: this.state.fetchingDownload++ })
                    let response = await api.getUrlDownladOneFile(this.state.expediente.Id_Expediente, this.props.trabajo, item.Id_Estructura)
                    if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                        this.props.fetchErrorExpediente(response);
                    }
                    if (response.Archivos && response.Archivos.length === 1) {
                        this.download_file(response.Archivos[0].Url, response.Archivos[0].Nombre);
                        let state_files = this.state.data
                        state_files.map(async (_item, _pos) => {
                            if (_item.Id_Estructura === item.Id_Estructura)
                                await this.handleChange("checked", _pos, 'data')
                        })
                    }
                    await this.setState({ fetchingDownload: this.state.fetchingDownload-- })
                } else {
                    let arrayFiles = []
                    files.map(async item => {
                        await this.setState({ fetchingDownload: this.state.fetchingDownload++ })
                        arrayFiles.push({
                            Id_Estructura: item.Id_Estructura
                        })
                    });
                    let response = await api.getUrlDownladFiles(this.state.expediente.Id_Expediente, this.props.trabajo, arrayFiles)
                    if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                        this.props.fetchErrorExpediente(response);
                    }

                    if (response.Archivos) {
                        response.Archivos.map((i, p) => {
                            this.download_file(i.Url, i.Nombre);
                            return null
                        })
                    }

                    await this.setState({ fetchingDownload: this.state.fetchingDownload-- })

                }
            }
        }
    }
    async handleDocumentView(file) {
        try {
            let expediente = this.props.expediente.Expediente[0];
            let response = file.Id_Estructura
                ? await api.fileViewer(expediente.Id_Expediente, this.props.trabajo, file.Id_Estructura)
                : await api.getUrlDownladFilesTempFolder(expediente.Id_Expediente, [{ Nombre: file.Nombre }])

            if (response.Archivos && response.Archivos.length > 0) {
                window.open(response.Archivos[0].Url, "_blank");
            }
            else if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                this.props.fetchErrorExpediente(response);
            }
        } catch (error) {
            this.props.fetchErrorExpediente(formatMenssage(error));
        }
    }


    renderSize(size) {
        if (size < 1048576) {
            return (size / 1024).toFixed(2) + ' Kb'
        } else if (size < 1073741824) {
            return (size / 1024 / 1024).toFixed(2) + ' Mb'
        } else {
            return (size / 1024 / 1024 / 1024).toFixed(2) + ' Gb'
        }

    }

    handleChangeFichaTrabajo = (propertyName, checkedProperty = false) => (event) => {
        let trabajoCopy = {};
        Object.assign(trabajoCopy, this.state.workDetails);
        if (!checkedProperty)
            trabajoCopy.Trabajos[0][propertyName] = event.target.value;
        else {
            trabajoCopy.Trabajos[0][propertyName] = event.target.checked ? 1 : 0;
        }
        this.setState({ workDetails: trabajoCopy });
    }

    handleChangeFichaTrabajoTipo = () => (event) => {
        let trabajoCopy = Object.assign({}, this.state.workDetails);
        trabajoCopy.Trabajos[0].Es_Trabajo_Nuevo = ("Es_Trabajo_Nuevo" === event.target.value) ? 1 : 0;
        trabajoCopy.Trabajos[0].Es_Trabajo_Modificado_Sustancial = ("Es_Trabajo_Modificado_Sustancial" === event.target.value) ? 1 : 0;
        trabajoCopy.Trabajos[0].Es_Trabajo_Modificado_Correcion_Basica = ("Es_Trabajo_Modificado_Correcion_Basica" === event.target.value) ? 1 : 0;

        if ("Es_Trabajo_Nuevo" === event.target.value) {
            trabajoCopy.Trabajos[0].Es_Trabajo_Modificado_Requerido_Administracion = 0;
        } else {
            trabajoCopy.Trabajos[0].Es_Trabajo_Modificado_Requerido_Administracion = this.state.administrativeNotivficationSave;
        }
        this.setState({ workDetails: trabajoCopy });
    }

    getCleanedString(cadena) {
        if (cadena == null)
            return '';
        var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

        for (var i = 0; i < specialChars.length; i++) {
            cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
        }
        cadena = cadena.toLowerCase();
        cadena = cadena.replace(/ /g, "_");
        cadena = cadena.replace(/á/gi, "a");
        cadena = cadena.replace(/é/gi, "e");
        cadena = cadena.replace(/í/gi, "i");
        cadena = cadena.replace(/ó/gi, "o");
        cadena = cadena.replace(/ú/gi, "u");
        cadena = cadena.replace(/ñ/gi, "n");
        return cadena;
    }

    estadoColor = (nombre) => {
        let nombreLimpio = this.getCleanedString(nombre);
        if (nombreLimpio !== '')
            return (
                <div className={nombreLimpio}>
                    <img alt={200} src={this.iconUrl(nombreLimpio)} />
                    {nombre}
                </div>);
    }

    iconUrl = (nombreLimpio) => {
        try {
            return require(`../../../Tramitaciones/IconosEstados/${nombreLimpio}.svg`);
        } catch (e) {
            return require(`../../../Tramitaciones/IconosEstados/borrador.svg`);
        }
    }

    async putFichaTrabajo() {
        try {
            this.setState({ loadingUpdateFichaTrabajo: true });
            let trabajo = this.state.workDetails.Trabajos[0];
            let data = {
                "Id_Tipo_Tramite": trabajo.Id_Tipo_Tramite,
                "Es_Trabajo_Nuevo": trabajo.Es_Trabajo_Nuevo,
                "Es_Trabajo_Modificado_Correcion_Basica": trabajo.Es_Trabajo_Modificado_Correcion_Basica,
                "Es_Trabajo_Modificado_Sustancial": trabajo.Es_Trabajo_Modificado_Sustancial,
                "Es_Trabajo_Modificado_Requerido_Administracion": trabajo.Es_Trabajo_Modificado_Requerido_Administracion,
                "Observaciones": trabajo.Observaciones,
                "Envio_Administracion": trabajo.Envio_Administracion,
                "Titulo_Complementario": trabajo.Titulo_Complementario
            }
            let response = await putFichaTrabajo(this.props.expediente.Expediente[0].Id_Expediente, this.props.trabajo, data)
            if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                this.props.fetchErrorExpediente(response);
                this.setState({ loadingUpdateFichaTrabajo: false });

            }
            else {
                let workDetails = response && response.Trabajos && response.Trabajos.length > 0
                    ? response.Trabajos[0].Es_Trabajo_Modificado_Requerido_Administracion : 0;
                this.setState({
                    loadingUpdateFichaTrabajo: false,
                    administrativeNotivficationSave: workDetails
                });
            }
        } catch (e) {
            this.props.fetchErrorExpediente(this.props.ormatMenssage(e.message));
            this.setState({ loadingUpdateFichaTrabajo: false });
        }
    }

    dragStart = (item, temporal) => (event) => {
        let allFiles = this.itemsToRemove();
        if (!item.checked && temporal)
            allFiles.temporalFiles.push(item);
        if (!item.checked && !temporal)
            allFiles.files.push(item);
        this.props.dragging(allFiles)
    }



    render() {
        let { classes } = this.props
        let disableButtons = this.props.disableActions;
        return (
            <div>
                {this.state.fetchingCenter ?
                    <Paper style={{marginLeft: -10}} className="mt-3">
                        <Grid container spacing={24}>
                            <Grid item xs={12} className='p-3 text-center'>
                                <CircularProgress/>
                            </Grid>
                        </Grid>
                    </Paper>:
                    <Paper style={{ paddingLeft: 10 }}>
                        <div>
                            <Grid container spacing={16}>
                                <Grid item xs={6} className="px-3 py-2 mt-1">
                                    <h6 style={{paddingBottom:12}}>{this.props.estructura
                                        ? <Translate id="languages.fileUpload.filesInFolder" />
                                        : <Translate id="languages.fileUpload.filesOfWork" />}  <text
                                        style={{color: 'red'}}> ({this.state.data.length})</text></h6>
                                </Grid>
                                <Grid item xs={6} className="px-3 py-1 text-right">
                                    <Grid container>
                                        <Grid item xs={12} className="pr-3 text-right">
                                            <div className="" style={{ float: 'right' }}>
                                                <Button className="px-2"
                                                        color="primary"
                                                        style={{fontSize: 12, padding: '4px 8px'}}
                                                        onClick={() => {
                                                            this.handleDownload()
                                                        }}
                                                        disabled={this.state.showDownloadButton !== true || this.state.fetchingDownload}>
                                                    <Translate id="languages.generalButton.download" />
                                                </Button>
                                                {this.state.fetchingDownload ? <CircularProgress size={24}
                                                                                                 className={classes.buttonProgress} /> : null}
                                            </div>
                                            <div className="" style={{ float: 'right' }}>
                                                <Button className="px-2"
                                                        color="primary"
                                                        style={{fontSize: 12, padding: '4px 8px'}}
                                                        onClick={() => {
                                                            this.handleRemove()
                                                        }}
                                                        disabled={this.state.showDeleteButton !== true || this.state.fetchingRemove > 0
                                                        || disableButtons}>
                                                    <Translate id="languages.generalButton.delete" />
                                                </Button>
                                                {this.state.fetchingRemove > 0 && <CircularProgress size={24}
                                                                                                    className={classes.buttonProgress} />}
                                            </div>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>

                            <div style={{ marginLeft: -10, background: "#f5f5f5" }}>
                                <Divider height={2} />
                                <Grid container className="py-2 px-2">
                                    <Grid item md={5} xs={5} className="d-flex mr-3">
                                        <Checkbox
                                            checked={this.state.checkAll}
                                            onChange={this.handleCheckAll()}
                                            className="pl-1"
                                            style={{
                                                padding: 0,
                                                marginRight: 6
                                            }}
                                        />
                                        <Typography variant="subtitle2" className="text-uppercase">
                                            <Translate id="languages.fileUpload.fileName" />
                                        </Typography>
                                    </Grid>
                                    <Grid item md={3} xs={3}>
                                        <Typography variant="subtitle2" className="text-uppercase">
                                            <Translate id="languages.fileUpload.folder" />
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2} xs={2} className="p-3" className="text-uppercase text-right pr-2">
                                        <Typography variant="subtitle2">
                                            <Translate id="languages.fileUpload.firm" />
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Divider height={2} />
                            </div>
                        </div>
                        {this.state.fetchingCenter ?
                            <Paper style={{ marginLeft: -10 }} className="mt-3">
                                <Grid container spacing={24}>
                                    <Grid item xs={12} className='p-3 text-center'>
                                        <CircularProgress />
                                    </Grid>
                                </Grid>
                            </Paper> :
                            <Grid container spacing={16}>
                                {
                                    (this.state.data && this.state.data.length > 0) || (this.state.temporalFiles && this.state.temporalFiles.length > 0) ?
                                        <Grid item xs={12}>
                                            <Grid container spacing={24}>
                                                <Grid item xs={12} style={{ paddingLeft: 2, paddingBottom: 2 }}>

                                                    {
                                                        this.state.data && this.state.data.map((item, pos) => {


                                                            return (<div draggable="true"
                                                                         className={'draggable'}
                                                                         onDragEnd={() => { this.props.dragging(false); }}
                                                                         onDragStart={this.dragStart(item, false)}
                                                                         style={{ backgroundColor: '#cecece' }}>
                                                                <ExpansionPanel classes={{ root: classes.rootPanel }}
                                                                                expanded={this.state.panelExpanded === item.Id_Estructura}
                                                                                onChange={this.expandPanel(item.Archivo, item.Id_Estructura)}
                                                                                >
                                                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                                                                                           classes={{ content: classes.margin, expanded: classes.margin, root: pos % 2 !== 0 && classes.backgroundColor }}
                                                                                           className="pl-0">
                                                                        <Grid container spacing={0}>
                                                                            <Grid item xs={6} className='d-flex align-items-center'>
                                                                                <Checkbox
                                                                                    checked={item.checked ? item.checked : false}
                                                                                    onChange={this.handleChange("checked", pos, 'data')}
                                                                                    value={item.Archivo}
                                                                                />
                                                                                <Typography title={item.Archivo} style={{ overflow: 'hidden', marginRight: '5%', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className={item.Requisitos_Firma_Completos ? "" : classes.red}>
                                                                                    {item.Archivo}
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={3} className="align-self-center">
                                                                                <Typography onClick={()=>{
                                                                                    this.props.handleChangeEstructura(item.Id_Estructura_Padre,item.Carpeta)

                                                                                }} style={{textDecoration:'underline'}} className={item.Requisitos_Firma_Completos ? "" : classes.red}>
                                                                                    {item.Carpeta}
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={2} className="text-right align-self-center">
                                                                                {item.Requisitos_Firma_Completos ?
                                                                                    <CheckCircle className={classes.green} /> :
                                                                                    <Close className={classes.red} />
                                                                                }
                                                                            </Grid>
                                                                        </Grid>

                                                                    </ExpansionPanelSummary>
                                                                    <ExpansionPanelDetails className={pos % 2 !== 0 && classes.backgroundColor}>
                                                                        {this.state.loadingDetallesArchivo
                                                                            ? <CircularProgress />
                                                                            : <Grid container spacing={6}>
                                                                                <Grid item xs={12}>
                                                                                    <Grid container spacing={0}>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography variant="button" gutterBottom className="text-uppercase">
                                                                                                <Translate id="languages.fileUpload.fileSize" />
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography gutterBottom>
                                                                                                {this.state.detallesArchivo && this.state.detallesArchivo.Archivos && this.state.detallesArchivo.Archivos[0] ? this.renderSize(this.state.detallesArchivo.Archivos[0].Longitud) : ""}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>

                                                                                <Grid item xs={12}>
                                                                                    <Grid container spacing={0}>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography variant="button" gutterBottom className="text-uppercase">
                                                                                                <Translate id="languages.fileUpload.uploadDate" />
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
                                                                                                <Translate id="languages.fileUpload.fileFirms" />
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            <Grid item xs={12} className="pt-0">
                                                                                                {
                                                                                                    this.state.detallesArchivo &&
                                                                                                    this.state.detallesArchivo.FirmasDigitales &&
                                                                                                    this.state.detallesArchivo.FirmasDigitales.length > 0
                                                                                                        ? this.state.detallesArchivo.FirmasDigitales.map((fd, pos) => {
                                                                                                            return fd.Id_Archivo === item.Id_Archivo
                                                                                                                ? <div className="pt-0 pb-2 px-0">
                                                                                                                    <ListItemText
                                                                                                                        primary={fd.Nombre} />
                                                                                                                </div>
                                                                                                                : ""
                                                                                                        })
                                                                                                        : <div>
                                                                                                            <ListItemText primary="--" />
                                                                                                        </div>
                                                                                                }
                                                                                            </Grid>

                                                                                        </Grid>

                                                                                    </Grid>
                                                                                </Grid>

                                                                                <Grid item xs={12}>
                                                                                    <Grid container spacing={0}>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography variant="button" gutterBottom>
                                                                                                <Translate id="languages.fileUpload.requiredFirms" />
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                        <Grid item xs={6}>
                                                                                            <Typography gutterBottom>
                                                                                                {this.state.detallesArchivo && this.state.detallesArchivo.Archivos && this.state.detallesArchivo.Archivos[0] ? this.state.detallesArchivo.Archivos[0].Firmas_Requeridas : ""}
                                                                                            </Typography>
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <Grid item xs={12}>
                                                                            <span className={classes.link} onClick={() => this.handleDocumentView(item)}>
                                                                                <Translate id="languages.fileUpload.viewDocument" />
                                                                            </span>
                                                                                </Grid>
                                                                            </Grid>}
                                                                    </ExpansionPanelDetails>
                                                                </ExpansionPanel>
                                                            </div>);
                                                        })
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        :
                                        <Grid item xs={12}>
                                            <Grid container spacing={24}>
                                                <Grid item xs={12} className="text-center py-4">
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        <Translate id="languages.fileUpload.noResult" />
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                        </Grid>

                                }
                            </Grid>
                        }
                    </Paper>
                }
            </div>

        );
    }


}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(FilesInFolder)));
