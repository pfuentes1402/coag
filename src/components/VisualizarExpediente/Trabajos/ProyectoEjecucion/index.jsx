import React, {Component} from 'react';
import {
    Grid,
    Paper,
    CircularProgress,
    Typography,
    Toolbar,
    Button,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    LinearProgress
} from '@material-ui/core';
import UploadFile from './uploadFile';
import * as api from '../../../../api'
import CloudUpload from '@material-ui/icons/CloudUpload';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Close from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import moment from 'moment'
import renderHTML from 'react-render-html';
import Dropzone from "react-dropzone";

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
                    await api.uploadFile(b.state.expediente.Id_Expediente, b.props.trabajo, b.props.estructura.id, item)
                        .then(async () => {
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
                            }
                            resolve()
                        })

                }





                // setTimeout(async function () {
                //     let newList = [...b.state.pendingUploadList]
                //     newList.splice(0,1);
                //
                //
                //     await b.setState({
                //         currentUpload:i+1,
                //         currentUploadItem:item,
                //         pendingUploadList:newList,
                //     });
                //     if(newList.length==0){
                //         await b.setState({
                //             uploadInProgress:false
                //         });
                //     }
                //     resolve();
                // }, 1000)
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
        let expediente = this.props.expediente.Expediente[0]
        console.log('expedient', expediente)
        if (this.props.estructura) {
            let response = await api.getFilesFromFolder(expediente.Id_Expediente, this.props.trabajo, this.props.estructura.id)
            let documentos = response.data.Archivos
            let firmasDigitales = response.data.FirmasDigitales
            let folderInfoResponse = await api.getFolderDetails(expediente.Id_Expediente, this.props.trabajo, this.props.estructura.id)
            let folderInfo = folderInfoResponse.data.Carpetas[0]
            this.setState({fetching: false, expediente, data: documentos, folderInfo, firmasDigitales})
        } else {
            //todo: Falta ver como obtener todos los archivos del expediente
        }


    }

    expandPanel(id = false) {
        if (this.state.panelExpanded === id) {
            this.setState({panelExpanded: false})
        } else {
            this.setState({panelExpanded: id})
        }

    }

    render() {
        return (
            <div style={{minHeight: 800}} className="m-2">
                <Grid container spacing={16}>
                    <Grid item md={8} xs={12} className="p-3">
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
                                                    <Grid item xs={6} className="p-3"><h6>Archivos de carpeta</h6></Grid>
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
                                            <div style={{paddingLeft: 10}}>
                                                <Grid container spacing={16}>
                                                    <Grid xs={5} className="p-3"><b>NOMBRE DEL ARCHIVO</b></Grid>
                                                    <Grid xs={4} className="p-3"><b>ÚLTIMA MODIFICACIÓN</b></Grid>
                                                    <Grid xs={2} className="p-3"><b>FIRMA</b></Grid>
                                                </Grid>
                                                {
                                                    this.state.data.map((item, pos) => {
                                                        return (<ExpansionPanel expanded={this.state.panelExpanded === pos}
                                                                                onChange={() => this.expandPanel(pos)}>
                                                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                                                <Grid container spacing={16}>
                                                                    <Grid xs={6}
                                                                          className="p-3"><Typography>{item.Archivo}</Typography></Grid>
                                                                    <Grid xs={4}
                                                                          className="p-3"><Typography>??????</Typography></Grid>
                                                                    <Grid xs={2}
                                                                          className="p-3">{item.Requisitos_Firma_Completos ?
                                                                        <CheckCircle/> :
                                                                        <Close style={{color: 'red'}}/>}</Grid>
                                                                </Grid>
                                                            </ExpansionPanelSummary>
                                                            <ExpansionPanelDetails>
                                                                <div style={{width: '100%'}}>
                                                                    <Grid container spacing={16}>
                                                                        <Grid xs={6} className="p-3"><b
                                                                            style={{fontSize: 12}}>TAMAÑO DEL
                                                                            ARCHIVO</b></Grid>
                                                                        <Grid xs={6}
                                                                              className="p-3"><Typography>??????</Typography></Grid>
                                                                    </Grid>
                                                                    <Grid container spacing={16}>
                                                                        <Grid xs={6} className="p-3"><b
                                                                            style={{fontSize: 12}}>FIRMAS DEL
                                                                            ARCHIVO</b></Grid>
                                                                        <Grid xs={6} className="p-3">
                                                                            <ul style={{paddingLeft: 0}}>
                                                                                {
                                                                                    this.state.firmasDigitales.map((fd, pos) => {
                                                                                        if (fd.Id_Archivo == item.Id_Archivo) {
                                                                                            return (
                                                                                                <li style={{fontSize: 12}}>{fd.Nombre}</li>)
                                                                                        } else {
                                                                                            return null;
                                                                                        }
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid container spacing={16}>
                                                                        <Grid xs={6} className="p-3"><b
                                                                            style={{fontSize: 12}}>FIRMAS
                                                                            REQUERIDAS</b></Grid>
                                                                        <Grid xs={6}
                                                                              className="p-3"><Typography>??????</Typography></Grid>
                                                                    </Grid>
                                                                </div>
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
                    <Grid item md={4} xs={12} className="p-3">
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
                        {
                            // !this.state.fetching ?
                            //     <div style={{marginTop: 20}}>
                            //         <UploadFile/>
                            //     </div> : null
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default TrabajoEjecucion;