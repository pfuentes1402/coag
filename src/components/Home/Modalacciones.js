import React, {Component} from 'react';
import {Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import { withLocalize } from 'react-localize-redux';
import { Translate } from "react-localize-redux";
import { fetchocultaModal, fetchCambiaStadoModalFalse } from '../../actions/interfaz/index'
import {fetchBuscador } from '../../actions/expedientes/index'
import {fetchSelect, fetchSuscepAcciones } from '../../actions/usuarios/index'
import './styles.css';
import TablaDatosModal  from '../Busquedas/TablaDatosModal';
import TablaBusquedaArquitectos  from '../Busquedas/TablaBusquedaArquitectos';
import {Divider, Typography, IconButton, FormControl, TextField, Button, Select, MenuItem, CircularProgress} from "@material-ui/core";
import {Close, Search} from "@material-ui/icons";
import {fetchErrorExpediente, formatMenssage} from "../../actions/expedientes";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    modal: {
        zIndex: 999,
        position: "absolute",
        right: 0,
        top: 0,
        backgroundColor: "white",
        border: "grey solid 0.5px",
        height: "100%",
        [theme.breakpoints.down('xs')]: {
            width: "100%"
        },
        [theme.breakpoints.up('xs')]: {
            width: "50%"
        },
    },
    formControl: {
        width: "100%"
    }
});
class Modalacciones extends Component { 
    
    constructor(props) {
        super(props);
        this.state = {
            filtro: '',
            tablaArquitectos: false,
            text: "",
            types: "expedientes",
            loading: false,
            loadingSearch: false
        };
       
      }

    async componentDidMount(){
        this.props.fetchSelect(this.state.types);
        this.setState({loading: true});
        try {
            if(this.props.modal){
                await this.props.fetchBuscador(this.state.text, this.state.types, 1, 10000 );
            }
            else {
                await this.props.fetchSuscepAcciones(this.state.text, this.props.idAccion, 1, 10000);
            }
            this.setState({loading: false});
        }
        catch (e) {
            this.props.fetchErrorExpediente(formatMenssage(e.message));
            this.setState({loading: false});
        }

    }
    async handleSearch(text) {
        this.setState({loadingSearch: true});
        try {
            if(this.props.modal){
                if(text === 'colegiados' && !text){
                    this.props.fetchErrorExpediente(formatMenssage("Debe especificar un filtro para la búsqueda"));
                }else {
                    await this.props.fetchBuscador(text, this.props.selectBuscador);
                }
            }
            else {
                await this.props.fetchSuscepAcciones(text, this.props.idAccion, 1, 10000);
            }
            this.setState({loadingSearch: false})
        }
        catch (e) {
            this.props.fetchErrorExpediente(formatMenssage(e.message));
            this.setState({loadingSearch: false});
        }

    }

    async handleCancel() {
        this.setState({text: "",loadingSearch: true});
        try {
            await this.props.fetchBuscador("", this.props.selectBuscador);
            this.setState({loadingSearch: false});
        }
        catch (e) {
            this.props.fetchErrorExpediente(formatMenssage(e.message));
            this.setState({loadingSearch: false});
        }
    }

    handleSelectChange(e){ 
        let value = e.target.value;
        this.setState({types: value});
        if(value === 'colegiados' || value === 'promotores' || value === 'otrosAgentes'){
            this.setState({tablaArquitectos: true,itemSelected:value})
        }
        else {
            this.setState({tablaArquitectos: false})
        }
        this.props.fetchSelect(value);
        if(value === 'colegiados' && !this.state.text){
            this.props.fetchErrorExpediente(formatMenssage("Debe especificar un filtro para la búsqueda"));
        }else {
            this.props.fetchBuscador(this.state.text, value);
        }

    }


    handleClose(){
        this.props.fetchocultaModal();
        this.props.fetchCambiaStadoModalFalse();
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
  
    render() {
        const RenderTipoTabla = () => {
            if(this.state.tablaArquitectos === true){
                return (
                    <TablaBusquedaArquitectos itemSelected={this.state.itemSelected} data={this.props.datosTablaResult}/>
                );
            }else{
                return (
                    <TablaDatosModal data={this.props.datosTablaResult} isTrabajo={this.state.types === "trabajos"}/>
                );
            }
            
        }

        let {classes, modal} = this.props;

        return (           

            <div className={classes.modal}>
                <Container className="full">
                    <Row>
                        {
                            this.props.loading === true || this.state.loading ?
                                <div style={{margin: "50%"}}>
                                    <CircularProgress/>
                                </div> :
                                <Col xs={12}>
                                    <Row>
                                        <Col xs={12} className="d-flex justify-content-between align-items-center">
                                            <Typography variant="h5" gutterBottom className="m-0">
                                                {
                                                    modal ?
                                                        <Translate id="languages.search.generalTitle"/> :
                                                        this.props.tituloModal
                                                }
                                            </Typography>
                                            <IconButton className={classes.button} aria-label="Close" onClick={()=>{this.handleClose()}}>
                                                <Close/>
                                            </IconButton>
                                        </Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col xs={12} className="pb-3">
                                            <Typography variant="subtitle2" gutterBottom className="pt-3">
                                                {
                                                    modal ?
                                                        <Translate id="languages.search.generalDescription"/> :
                                                        this.props.descripcion
                                                }
                                            </Typography>
                                            <div style={{width: 350, margin: "auto"}}>
                                                    <Row className="align-items-center">
                                                        <Col xs={modal ? 8 : 12} className="pl-0 pr-2">
                                                            <FormControl className={classes.formControl}>
                                                                <TextField
                                                                    id="filter"
                                                                    label={<Translate id="languages.search.generalTerm"/>}
                                                                    value={this.state.text}
                                                                    onChange={this.handleChange('text')}
                                                                    margin="normal"
                                                                    autoFocus={true}
                                                                />
                                                            </FormControl>
                                                        </Col>
                                                        {
                                                            modal ?
                                                            <Col xs={4} className="p-0">
                                                                <FormControl className={classes.formControl}>
                                                                    <Select className="pt-4"
                                                                            value={this.state.types}
                                                                            onChange={(e) => {
                                                                                this.handleSelectChange(e)
                                                                            }}
                                                                    >
                                                                        <MenuItem value="expedientes">
                                                                            <Translate
                                                                                id="languages.generalText.expedientes"/>
                                                                        </MenuItem>
                                                                        <MenuItem value="trabajos">
                                                                            <Translate
                                                                                id="languages.generalText.trabajos"/>
                                                                        </MenuItem>
                                                                        <MenuItem value="colegiados">
                                                                            <Translate
                                                                                id="languages.generalText.arquitectos"/>
                                                                        </MenuItem>
                                                                        <MenuItem value="promotores">
                                                                            <Translate
                                                                                id="languages.generalText.promotores"/>
                                                                        </MenuItem>
                                                                        <MenuItem value="otrosAgentes">
                                                                            <Translate
                                                                                id="languages.generalText.otrosTecnicos"/>
                                                                        </MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Col>
                                                                :
                                                                ""
                                                        }
                                                    </Row>
                                                    <div className="d-flex justify-content-center">
                                                        <Button variant="outlined" color="primary" className={classes.button} disabled={this.state.loadingSearch} onClick={async ()=>{await this.handleCancel()}}>
                                                            <Translate id="languages.generalButton.cancel"/>
                                                        </Button>
                                                        <Button variant="contained" color="primary" className={classes.button} disabled={this.state.loadingSearch} onClick={async ()=>{await this.handleSearch(this.state.text)}}>
                                                            <Translate id="languages.generalButton.search"/>
                                                            <Search className="ml-3" />
                                                        </Button>
                                                        {this.state.loadingSearch && <CircularProgress className="align-self-center" size={24}/>}
                                                    </div>
                                                </div>
                                        </Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col xs={12} className="d-flex">
                                            <Typography variant="h6" gutterBottom className="pt-2 mr-1">
                                                <Translate id="languages.generalText.resultados"/>
                                            </Typography>
                                            <Typography variant="h6" gutterBottom color="primary" className="pt-2">
                                                {" (" + (modal ? this.props.datosTablaResult.length : this.props.datosTabla.length)  + ")"}
                                            </Typography>
                                        </Col>
                                    </Row>
                                    <Divider/>
                                    <Row>
                                        <Col xs={12}>
                                            {modal ? RenderTipoTabla() : <TablaDatosModal data={this.props.datosTabla} isTrabajo={this.state.types === "trabajos"}/>}
                                        </Col>
                                    </Row>
                                </Col>
                        }
                    </Row>
                    
                </Container>
            </div>
        );
    }
}




const mapStateToProps = state => ({
    loading: state.status.modalLoading ? state.status.modalLoading : false,
    datosTabla: state.user.datosModal.expedientes ? state.user.datosModal.expedientes : '',
    datosTablaResult: state.user.datosModal.resultados ? state.user.datosModal.resultados :'',
    tituloModal:state.user.datosModal.tituloModal ? state.user.datosModal.tituloModal : '',
    descripcion: state.user.datosModal.descripcion ? state.user.datosModal.descripcion : '',
    modal: state.status.modal ? state.status.modal : '',
    idAccion: state.user.idAccion ? state.user.idAccion : 0,
    filtroBusqueda: state.user.filtroBusqueda ? state.user.filtroBusqueda : '',
    selectBuscador: state.user.selectBusqueda ? state.user.selectBusqueda : 'expedientes',
   
  });

const mapDispatchToProps = {
    fetchocultaModal,
    fetchCambiaStadoModalFalse,
    fetchBuscador,
    fetchSelect,
    fetchErrorExpediente,
    fetchSuscepAcciones
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(Modalacciones)));


