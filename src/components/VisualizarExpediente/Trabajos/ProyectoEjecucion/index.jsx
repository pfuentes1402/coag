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
        overflow:'hidden',
        paddingRight:'5%',
        textOverflow: 'ellipsis',
        whiteSpace:'nowrap'
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

class TrabajoEjecucion extends Component {
    componentWillReceiveProps(nextProps, nextContext) {
        this.reloadAfther1Second()
    }
    componentWillUnmount() {
        this.props.showUploadComponent()
    }

    async reloadAfther1Second() {
        await setTimeout(() => {
            if (this.props.fileUpload.fetchingDone) {
                this.loadInformation()
                this.props.dispatchSetFetchingDone();
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
            temporalFiles: []
        }
    }
    async onDrop(acceptedFiles) {
        let expediente = this.props.expediente.Expediente[0];

        if (this.props.estructura) {
            await this.props.uploadFiles(acceptedFiles, true, expediente, this.props.trabajo, this.props.estructura)
        } else {
            await this.props.uploadFiles(acceptedFiles, false, expediente, this.props.trabajo)
        }
        await this.setState({
            uploadInProgress: true
        })
        this.props.refreshTree()
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

        if (this.props.estructura) {

            let folderInfoResponse = await api.getFolderDetails(expediente.Id_Expediente, this.props.trabajo, this.props.estructura.id)
            let folderInfo = folderInfoResponse.data.Carpetas[0];


            await this.setState({ expediente, folderInfo, allowUpload: folderInfo.Permite_Anexar_Archivos === '1' ? true : false })
        } else {
            try {
                let workDetails = await api.getWorkDetails(expediente.Id_Expediente, this.props.trabajo);
                workDetails = workDetails.data;
                await this.setState({
                    expediente,
                    allowUpload: workDetails.Trabajos[0].Estado && workDetails.Trabajos[0].Estado == 'Tramitado' ? false : true,
                    workDetails,
                })
            } catch (e) {
                this.props.fetchErrorExpediente(e);
            }
        }
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
                this.props.fetchErrorExpediente(actionsExpedientes.formatMenssage(e.message));
            }
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
        console.log("", tf);
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
            if (temporalFiles.length) {
                let arrayArchivos = [];
                temporalFiles.map(item => {
                    arrayArchivos.push({ Nombre: item.Nombre })
                    return null
                });
                let response = await api.removeFilesFromTemporalFolder(this.state.expediente.Id_Expediente, arrayArchivos)
                if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                    this.props.fetchErrorExpediente(response);
                } else {
                    let newData = [...this.state.temporalFiles];
                    temporalFiles.map(item => {
                        newData = newData.filter(current => current.Nombre !== item.Nombre)
                        return null
                    });

                    await this.setState({ temporalFiles: newData })
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
            if (temporalFiles.length) {
                let arrayArchivos = [];
                temporalFiles.map(item => {
                    arrayArchivos.push({ Nombre: item.Nombre })
                    return null
                });
                let response = await api.getUrlDownladFilesTempFolder(this.state.expediente.Id_Expediente, arrayArchivos)
                if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                    this.props.fetchErrorExpediente(response);
                }
                if (response.Archivos) {
                    response.Archivos.map((i, p) => {
                        this.download_file(i.Url, i.Nombre);
                        return null
                    })
                }
                let newData = [...this.state.temporalFiles];
                temporalFiles.map(item => {
                    newData = newData.filter(current => current.Nombre !== item.Nombre)
                    return null
                });

            }




        }
    }
    async handleAutoAsign() {
        let { temporalFiles } = this.itemsToRemove();
        if (temporalFiles.length > 0) {
            try {
                await this.setState({ fetchingAutoAsign: true })
                let files = [];
                temporalFiles.map(item => {
                    files.push({
                        Nombre: item.Nombre
                    })
                    return null
                });
                let result = await api.autoAsignFilesFromTemporalFiles(this.state.expediente.Id_Expediente, this.props.trabajo, files)
                if (result.Archivos) {
                    result.Archivos.map(item => {
                        if (item.Insertado !== 1) {
                            this.props.fetchErrorExpediente(api.formatMenssage(`${item.Nombre} ${this.props.translate("languages.fileUpload.noInsertion")}`))

                        } else {
                            this.props.fetchErrorExpediente(api.formatMenssage(`${item.Nombre} ${this.props.translate("languages.fileUpload.successInsertion")} ${item.Carpeta}`))
                        }
                        return null
                    })
                } else {
                    this.props.fetchErrorExpediente(actionsExpedientes.formatMenssage(this.props.translate("languages.messages.fetchError")));
                }
                await this.setState({ fetchingAutoAsign: false, showDeleteButton: false, showDownloadButton: false })
                await this.loadInformation();
            } catch (e) {
                await this.setState({ fetchingAutoAsign: false })
                this.props.fetchErrorExpediente(actionsExpedientes.formatMenssage(e.message));
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
        let trabajoCopy = {};
        Object.assign(trabajoCopy, this.state.workDetails);
        trabajoCopy.Trabajos[0].Es_Trabajo_Nuevo = ("Es_Trabajo_Nuevo" === event.target.value) ? 1 : 0;
        trabajoCopy.Trabajos[0].Es_Trabajo_Modificado_Sustancial = ("Es_Trabajo_Modificado_Sustancial" === event.target.value) ? 1 : 0;
        trabajoCopy.Trabajos[0].Es_Trabajo_Modificado_Correcion_Basica = ("Es_Trabajo_Modificado_Correcion_Basica" === event.target.value) ? 1 : 0;
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
                    <img alt={200} src={require(`../../../Tramitaciones/IconosEstados/${nombreLimpio}.svg`)} />
                    {nombre}
                </div>);
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
                this.setState({ loadingUpdateFichaTrabajo: false });
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

    renderFichaTrabajo() {
        let { classes } = this.props;
        let work = this.state.workDetails && this.state.workDetails.Trabajos && this.state.workDetails.Trabajos.length > 0
            ? this.state.workDetails.Trabajos[0] : {};
        return (this.state.workDetails && this.state.workDetails.Trabajos
            && this.state.workDetails.Trabajos.length > 0)
            && <ExpansionPanel expanded={this.state.fichaTrabajoOpen}
                onChange={() => this.setState({ fichaTrabajoOpen: !this.state.fichaTrabajoOpen })}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className="d-flex justify-content-between align-items-center" style={{ width: "100%" }}>
                        <Typography variant='button'>
                            <Translate id="languages.fileUpload.formWork" />
                        </Typography>
                        <div className={`${work.SePuede_Editar !== 1 ? classes.disabledContainer : ""}`}>
                            <Button type="submit" color="primary" onClick={async () => { await this.putFichaTrabajo() }} disabled={this.state.loadingUpdateFichaTrabajo} style={this.state.fichaTrabajoOpen ? {} : { display: "none" }} >
                                <Translate id="languages.generalButton.generalButton" /> <Check />
                            </Button>
                            {this.state.loadingUpdateFichaTrabajo ? <CircularProgress size={24} /> : ""}
                        </div>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ padding: 0 }}
                    className={`${work.SePuede_Editar !== 1 ? classes.disabledContainer : ""}`}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Grid container spacing={0} className="py-3 px-4">
                                <Grid item xs={8}>
                                    <FormControl className={`${classes.formControl} pr-3`}>
                                        <TextField
                                            value={this.state.workDetails.Trabajos[0].Titulo_Complementario ? this.state.workDetails.Trabajos[0].Titulo_Complementario : ""}
                                            label={<Translate id="languages.fileUpload.complementaryTitle" />}
                                            className={`text-uppercase`}
                                            placeholder=""
                                            InputLabelProps={{ shrink: true }}
                                            onChange={this.handleChangeFichaTrabajo("Titulo_Complementario")}
                                            name="tituloComplementario" />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1" gutterBottom className="m-0 text-uppercase"
                                        style={{ color: "rgba(0, 0, 0, 0.55)", fontSize: "0.8rem" }}>
                                        <Translate id="languages.fileUpload.entryDate" />
                                    </Typography>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {this.state.workDetails.Trabajos[0].Fecha_entrada ? moment(new Date(this.state.workDetails.Trabajos[0].Fecha_entrada)).format("DD/MM/YYYY") : ""}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.backgroundColor}>
                            <Grid container spacing={0} className="p-4">
                                <Grid item xs={8}>
                                    <Typography variant="subtitle1" gutterBottom className="m-0 text-uppercase"
                                        style={{ color: "rgba(0, 0, 0, 0.55)", fontSize: "0.8rem" }}>
                                        <Translate id="languages.fileUpload.state" />
                                    </Typography>
                                    <div className='estados'>
                                        {this.estadoColor(this.state.workDetails.Trabajos[0].Estado ? this.state.workDetails.Trabajos[0].Estado : "")}
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1" gutterBottom className="m-0 text-uppercase"
                                        style={{ color: "rgba(0, 0, 0, 0.55)", fontSize: "0.8rem" }}>
                                        <Translate id="languages.fileUpload.visaDate" />
                                    </Typography>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {this.state.workDetails.Trabajos[0].Fecha_Tramitacion ? moment(new Date(this.state.workDetails.Trabajos[0].Fecha_Tramitacion)).format("DD/MM/YYYY") : ""}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={0} className="p-4">
                                <Grid item xs={3}>
                                    <FormControl className={classes.formControl}>
                                        <Select className={`${work.SePuede_EditarTipoTramite !== 1 ? classes.disabledContainer : ""}`}
                                            value={this.state.workDetails.Trabajos[0].Tipo_Tramite}
                                            displayEmpty
                                            onChange={this.handleChangeFichaTrabajo("Tipo_Tramite")}
                                            inputProps={{
                                                name: 'Tipo_Tramite',
                                                id: 'Tipo_Tramite',
                                            }}>
                                            {this.state.tiposTramites && this.state.tiposTramites.map(tramite => (
                                                <MenuItem
                                                    value={tramite.Nombre}>{tramite.Nombre}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={9}>
                                    <RadioGroup
                                        aria-label="Gender"
                                        name="gender1"
                                        className="flex-nowrap"
                                        value={this.state.workDetails.Trabajos[0].Es_Trabajo_Nuevo ? "Es_Trabajo_Nuevo" : (this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Sustancial ? "Es_Trabajo_Modificado_Sustancial" : "Es_Trabajo_Modificado_Correcion_Basica")}
                                        onChange={this.handleChangeFichaTrabajoTipo()}
                                        row>
                                        <FormControlLabel value="Es_Trabajo_Nuevo"
                                            control={<Radio className="pt-0" color={this.state.workDetails.Trabajos[0].Es_Trabajo_Nuevo ? "primary" : "secondary"} />}
                                            label={<Translate id="languages.trabajo.nuevoTrabajoTitle" />}
                                            className={`${this.state.workDetails.Trabajos[0].Es_Trabajo_Nuevo ? 'font-weight-bold' : ''} ${work.SePuede_EditarComoTrabajoNuevo === 0 && classes.disabledContainer} m-0 pt-0`}
                                        />
                                        <FormControlLabel
                                            value="Es_Trabajo_Modificado_Sustancial"
                                            control={<Radio className="pt-0" color={this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Sustancial ? "primary" : "secondary"} />}
                                            label={<Translate id="languages.trabajo.modificacionSustancialTitle" />}
                                            className={`${this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Sustancial ? 'font-weight-bold' : ''} m-0 pt-0`} />
                                        <FormControlLabel
                                            value="Es_Trabajo_Modificado_Correcion_Basica"
                                            control={<Radio className="pt-0" color={this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Correcion_Basica ? "primary" : "secondary"} />}
                                            label={<Translate id="languages.trabajo.correccionBasicaTitle" />}
                                            className={`${this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Correcion_Basica ? 'font-weight-bold' : ''} m-0 pt-0`} />
                                    </RadioGroup>

                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.backgroundColor}>
                            <Grid container spacing={0} className="p-3">
                                <Grid item xs={12}>
                                    <FormControl className={classes.formControl}>
                                        <TextField
                                            id="observations"
                                            label={<Translate id="languages.expedients.fieldObservaciones" />}
                                            value={this.state.workDetails.Trabajos[0].Observaciones ? this.state.workDetails.Trabajos[0].Observaciones : ''}
                                            onChange={this.handleChangeFichaTrabajo("Observaciones")}
                                            margin="normal"
                                            multiline
                                            rows={4}
                                            helperText={"110/500"}
                                            fullWidth
                                            InputProps={{
                                                disableUnderline: true,
                                                classes: {
                                                    input: classes.textFieldInput
                                                },
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onInput={(e) => {
                                                let aux = e.target.value;
                                                if (aux.length > 500) {
                                                    e.target.value = aux.slice(0, 500)
                                                }
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={0} className="p-4">
                                <Grid item xs={6}>
                                    <FormControl className={`${classes.formControl} pr-3`}>
                                        <Tooltip title={`${this.state.workDetails.Trabajos[0].Tipo_Grupo_tematico}/${this.state.workDetails.Trabajos[0].Tipo_Autorizacion_Municipal}`}>
                                            <TextField disabled={true}
                                                value={`${this.state.workDetails.Trabajos[0].Tipo_Grupo_tematico}/${this.state.workDetails.Trabajos[0].Tipo_Autorizacion_Municipal}`}
                                                label={<Translate id="languages.fileUpload.expedientType" />}
                                                className={`text-uppercase`}
                                            />
                                        </Tooltip>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl className={classes.formControl}>
                                        <TextField disabled={true}
                                            value={this.state.workDetails.Trabajos[0].Tipo_Fase}
                                            label={<Translate id="languages.fileUpload.documentation" />}
                                            className={`text-uppercase`}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.backgroundColor}>
                            <Grid container spacing={0} className="py-3 px-4">
                                <Grid item xs={6} style={{ display: "flex" }}>
                                    <FormControlLabel
                                        key="administrationSend"
                                        control={
                                            <Checkbox
                                                checked={this.state.workDetails.Trabajos[0].Envio_administracion === 1}
                                                onChange={this.handleChangeFichaTrabajo("Envio_administracion", true)}
                                                className="pl-1"
                                                value={this.state.workDetails.Trabajos[0].Envio_administracion}
                                                color="primary" />
                                        }
                                        label={<Translate id="languages.fileUpload.administrationSend" />}
                                        disabled={work.SePuede_EditarEnvioAdministracion === 0}
                                    />
                                </Grid>

                                <Grid item xs={6} style={{ display: "flex" }}>
                                    <FormControlLabel
                                        key="administrativeNotification"
                                        control={
                                            <Checkbox
                                                checked={this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Requerido_Administracion === 1}
                                                onChange={this.handleChangeFichaTrabajo("Es_Trabajo_Modificado_Requerido_Administracion", true)}
                                                className="pl-1"
                                                value={this.state.workDetails.Trabajos[0].Es_Trabajo_Modificado_Requerido_Administracion}
                                                color="primary" />
                                        }
                                        label={<Translate id="languages.fileUpload.administrativeNotification" />}
                                        disabled={this.state.workDetails.Trabajos[0].Es_Trabajo_Nuevo === 1} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
    }

    renderFilesOfWork() {
        let { classes } = this.props
        let disableButtons = this.props.disableActions;
        return (
            <Paper style={{ paddingLeft: 10 }}>
                <div>
                    <Grid container spacing={16}>
                        <Grid item xs={6} className="px-3 py-2 mt-1">
                            <h6>{this.props.estructura
                                ? <Translate id="languages.fileUpload.filesInFolder" />
                                : <Translate id="languages.fileUpload.filesOfWork" />}</h6>
                        </Grid>
                        <Grid item xs={6} className="px-3 py-1 text-right">
                            {
                                this.props.fileUpload.uploadInProgress || !this.state.allowUpload ? null :
                                    <Dropzone style={{
                                        width: 'auto',
                                        height: 'auto',
                                        borderStyle: 'none'
                                    }}
                                        accept="application/pdf"
                                        onDrop={(acceptedFiles) => this.onDrop(acceptedFiles)}>
                                        <Button color="primary" disabled={disableButtons}>
                                            <Translate id="languages.fileUpload.addFiles" /> <CloudUpload
                                                style={{ marginLeft: 5 }} />
                                        </Button>
                                    </Dropzone>
                            }
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} className="pr-3 text-right">
                            {
                                this.state.temporalFiles ?
                                    <div className="" style={{ float: 'right' }}>
                                        <Button className="px-2"
                                            color="primary"
                                            onClick={() => {
                                                this.handleAutoAsign()
                                            }}
                                            disabled={this.state.disableAutoAsignButton || this.state.fetchingAutoAsign > 0}>
                                            <Translate id="languages.fileUpload.automaticSection" />
                                        </Button>
                                        {this.state.fetchingAutoAsign > 0 && <CircularProgress size={24}
                                            className={classes.buttonProgress} />}
                                    </div> : null
                            }
                            <div className="" style={{ float: 'right' }}>
                                <Button className="px-2"
                                    color="primary"
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
                            <div className="" style={{ float: 'right' }}>
                                <Button className="px-2"
                                    color="primary"
                                    onClick={() => {
                                        this.handleDownload()
                                    }}
                                    disabled={this.state.showDownloadButton !== true || this.state.fetchingDownload}>
                                    <Translate id="languages.generalButton.download" />
                                </Button>
                                {this.state.fetchingDownload ? <CircularProgress size={24}
                                    className={classes.buttonProgress} /> : null}
                            </div>
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
                                                this.state.temporalFiles && this.state.temporalFiles.map((item, pos) => {
                                                    return (
                                                        <div draggable="true"
                                                            className={'draggable'}
                                                            onDragEnd={() => { this.props.dragging(false) }}
                                                            onDragStart={this.dragStart(item, true)}
                                                            style={{ backgroundColor: '#cecece' }}
                                                        ><ExpansionPanel classes={{ root: classes.rootPanel }}
                                                            expanded={this.state.panelExpanded === item.Nombre}
                                                            onChange={this.expandPanel(item.Nombre, false)}
                                                            style={{ borderRadius: 0 }}>
                                                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} classes={{ content: classes.margin, expanded: classes.margin, root: pos % 2 !== 0 && classes.backgroundColor }}
                                                                    className="pl-0">
                                                                    <Grid container spacing={0}>
                                                                        <Grid item md={6} xs={6} className='d-flex align-items-center'>
                                                                            <Checkbox
                                                                                checked={item.checked ? item.checked : false}
                                                                                onChange={this.handleChange("checked", pos, 'temporalFiles')}
                                                                                value={item.Nombre}
                                                                            />
                                                                            <Typography className={classes.orange}>{item.Nombre}</Typography>
                                                                        </Grid>
                                                                        <Grid item md={3} xs={3} className="align-self-center">
                                                                            <Typography className={classes.orange}>
                                                                                <Translate id="languages.fileUpload.unAssigned" />
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item md={2} xs={2} className="text-right align-self-center">
                                                                            <ErrorOutline className={classes.orange} size={24} />
                                                                        </Grid>
                                                                    </Grid>
                                                                </ExpansionPanelSummary>
                                                                <ExpansionPanelDetails className={pos % 2 !== 0 && classes.backgroundColor}>
                                                                    <Grid container spacing={16}>
                                                                        <Grid item xs={6} className="align-items-center">
                                                                            <Grid container spacing={0}>
                                                                                <Grid item xs={12}>
                                                                                    <Typography variant="button" gutterBottom className="text-uppercase">
                                                                                        <Translate id="languages.fileUpload.fileSize" />
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

                                                                        <Grid item xs={12}>
                                                                            <span className={classes.link} onClick={() => this.handleDocumentView(item)}>
                                                                                <Translate id="languages.fileUpload.viewDocument" />
                                                                            </span>
                                                                        </Grid>
                                                                    </Grid>

                                                                </ExpansionPanelDetails>
                                                            </ExpansionPanel></div>)
                                                })
                                            }
                                            {
                                                this.state.data && this.state.data.map((item, pos) => {
                                                    return (<div draggable="true"
                                                        className={'draggable'}
                                                        onDragEnd={() => { this.props.dragging(false); }}
                                                        onDragStart={this.dragStart(item, false)}
                                                        style={{ backgroundColor: '#cecece' }}>
                                                        <ExpansionPanel classes={{ root: classes.rootPanel }}
                                                            expanded={this.state.panelExpanded === item.Id_Estructura}
                                                            onChange={this.expandPanel(item.Archivo, item.Id_Estructura)}>
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
                                                                        <Typography className={item.Requisitos_Firma_Completos ? "" : classes.red}>
                                                                            {item.Archivo}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={3} className="align-self-center">
                                                                        <Typography className={item.Requisitos_Firma_Completos ? "" : classes.red}>
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
        );
    }

    render() {
        let { classes } = this.props
        return (
            <div style={{ minHeight: 800 }} className="m-2">
                <Grid container spacing={16}>
                    <Grid item md={6} xs={12} className="p-3">
                        {
                            this.state.fetching ?
                                <div className="text-center">
                                    <CircularProgress />
                                </div>
                                : <div>
                                    {this.renderFilesOfWork()}
                                </div>
                        }
                    </Grid>
                    <Grid item md={6} xs={12} className="p-3">
                        {
                            this.state.workDetails ?
                                this.renderFichaTrabajo()
                                : null
                        }
                        {
                            this.state.folderInfo ?
                                <Paper
                                    style={{ borderColor: '#cecece', borderWidth: 1, marginTop: -7, marginBottom: 10 }}>
                                    <div className="px-4 py-2">
                                        <Typography variant='button'>{this.state.folderInfo.Nombre}</Typography>
                                    </div>
                                    <div style={{ backgroundColor: '#f5f5f5', marginTop: 10, marginBottom: 10 }}>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12} className="px-4">
                                                <Grid container spacing={16}>
                                                    <Grid item xs={6} className="p-3">
                                                        <label style={{ textTransform: 'uppercase', fontSize: 12 }}>
                                                            <Translate id="languages.fileUpload.requiredFirms" /></label><br />
                                                        <b style={{
                                                            textTransform: 'uppercase',
                                                            fontSize: 12
                                                        }}>{this.state.folderInfo.Firmas_Requeridas}</b>
                                                    </Grid>
                                                    <Grid item xs={6} className="p-3">
                                                        <label style={{ textTransform: 'uppercase', fontSize: 12 }}>
                                                            <Translate id="languages.fileUpload.entryDate" /></label><br />
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
                                                            onChange={() => this.setState({ aclaracionesOpen: !this.state.aclaracionesOpen })}>
                                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                                {this.state.aclaracionesOpen
                                                                    ? <Translate id="languages.fileUpload.hideAclarations" />
                                                                    : <Translate id="languages.fileUpload.showAclarations" />}
                                                            </ExpansionPanelSummary>
                                                            <ExpansionPanelDetails>
                                                                <div style={{ width: '100%' }}>
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
                            this.props.fileUpload.uploadInProgress ?
                                <div style={{ marginTop: 20 }}>
                                    <Paper>
                                        <Grid container spacing={16}>
                                            <Grid item xs={7} className="p-3">
                                                <label style={{ fontSize: 12 }}>
                                                    <Translate id="languages.fileUpload.uploadingProgress" />
                                                    {this.props.fileUpload.currentUpload} de {this.props.fileUpload.uploadLength}</label>
                                            </Grid>
                                            <Grid item xs={5} className="p-3"
                                                style={{ paddingRight: 10, paddingLeft: 0, textAlign: 'right' }}>
                                                <a onClick={() => this.abortUpload()} style={{
                                                    fontSize: 12,
                                                    textDecoration: 'underline',
                                                    color: '#2196f3'
                                                }}>Cancelar subida</a>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={5}>
                                            <Grid item xs={12} className="p-3">
                                                <LinearProgress style={{ height: 20 }} variant="determinate"
                                                    value={this.props.fileUpload.currentUpload * 100 / this.props.fileUpload.uploadLength} />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={16}>
                                            <Grid item xs={12} className="p-3">
                                                <b style={{ fontSize: 12 }}>{this.props.fileUpload.currentUploadItem ? this.props.fileUpload.currentUploadItem.filename : null}</b>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={16}>
                                            <Grid item xs={12} className="p-3">
                                                <ul style={{ listStyle: 'none', overflowX: 'hidden' }}>
                                                    {
                                                        this.props.fileUpload.pendingUploadList.map((item, pos) => {

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
