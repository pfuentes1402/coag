import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Paper, Grid, TextField, FormControl, Button, CircularProgress, Snackbar, IconButton } from '@material-ui/core';
import {Check, Clear, Close} from '@material-ui/icons'
import {Container} from "reactstrap";
import {validateAddress, saveAdressTostore, updateAddress, fetchErrorExpediente } from '../../actions/expedientes';
import {postNuevoExpediente} from '../../api';
import { connect } from 'react-redux';
import CatastralTable from "./CatastralTable";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import AddressValidate from "../Address";
const styles = theme => ({
    paper: {
        padding: 24,
        width: "100%"
    },
    margin: {
        marginTop: 30
    },
    formControl1: {
        [theme.breakpoints.down('sm')]: {
            width: "100%"
        },
        width: "60%"
    },
    formControl2: {
        width: 150, marginRight: 16
    },
    formControl: {
        width: "100%"
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
    divider: {
        [theme.breakpoints.up('sm')]: {
            borderRight: "1px solid #ced4da"
        },

    },
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    close: {
        padding: theme.spacing.unit / 2,
    },
});

const mapStateToProps = (state) => (
     {
         addressData: state.expedientes.address ? state.expedientes.address : '',
         catastro: state.expedientes.addressreducida ? state.expedientes.addressreducida: [], /*Contiene arreglo de la tabla de ubicaciones */
         error: state.expedientes.error && state.expedientes.error.MensajesProcesado ? state.expedientes.error.MensajesProcesado : [],
     }
);

const mapDispatchToProps =
     {
        validateAddress: validateAddress,
        saveAdressTostore: saveAdressTostore,
        updateAddress: updateAddress,
         fetchErrorExpediente: fetchErrorExpediente

};


class AddExpedient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '', codeStudy: '', title: '', antecedent: '', observations: '',
            location: '', alias: '',
            catastro: [],
            linksMaps: [],
            locations: [],
            emplacement: [],
            isValidate: false,
            isShowAddress: false,
            alert: false,
            msg: "",
            observationsLength: 0,
            isSave: false
        };

    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };


    async handleSave(){
        if(!this.state.title || !this.state.codeStudy || (this.state.observationsLength > 0 && this.state.observationsLength < 110)){
            this.setState({alert: true, msg: (!this.state.title && !this.state.codeStudy) ? "El título y el código de estudio son obligatorios" : (!this.state.title ? "El título es obligatorio" : (!this.state.codeStudy ? "El código de estudio es obligatorio" : "Las observaciones requieren más de 110 caracteres"))})
        }
        else {
            this.setState({isSave: true});
            let fechaEntrada =  new Date();
            fechaEntrada = fechaEntrada.toISOString();
            let data = this.props.addressData.Datos_Completos[0];
            let expediente = {
                'Fecha_Entrada' : fechaEntrada,
                'Titulo' : this.state.title ,
                'Expediente_Codigo_Estudio' : this.state.codeStudy,
                'Antecedente' : this.state.antecedent,
                'Observaciones' : this.state.observations,
                'Emplazamientos' : [data],
                'IgnorarObservaciones': 1
            }
            let response = await postNuevoExpediente(expediente);
            this.setState({isSave: false});
            if (response.data && response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0) {
                this.props.fetchErrorExpediente(response.data);
            }
            else {

                this.props.history.push("/comunicacion/" + response.data.Expediente[0].Id_Expediente);
            }

        }

    }

    handleClose = () => {
        this.setState({ alert: false });
    };

    render() {
        let {classes} = this.props;
        let data = this.props.addressData.Datos_Completos[0];
        return (
            <Container className={classes.margin}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={this.state.alert}
                    autoHideDuration={5000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.state.msg}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <Close />
                        </IconButton>,
                    ]}
                />
                <Grid container spacing={8}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={24}>
                            <Grid item xs={12} md={6} className={classes.divider}>

                                <FormControl className={classes.formControl1}>
                                    <TextField
                                        id="code"
                                        label={<Translate id="languages.expedients.fieldCodigoExpediente"/>}
                                        value={this.state.code}
                                        onChange={this.handleChange('code')}
                                        margin="normal"
                                       disabled
                                    />
                                </FormControl>

                                <FormControl className={classes.formControl1}>
                                    <TextField
                                        required
                                        id="codeStudy"
                                        label={<Translate id="languages.expedients.fieldCodigoEstudio"/>}
                                        value={this.state.codeStudy}
                                        onChange={this.handleChange('codeStudy')}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl1}>
                                    <TextField
                                        required
                                        id="title"
                                        label={<Translate id="languages.expedients.fieldTitleExp"/>}
                                        value={this.state.title}
                                        onChange={this.handleChange('title')}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl1}>
                                    <TextField
                                        id="antecedent"
                                        placeholder="Ej 1234567865"
                                        label={<Translate id="languages.expedients.fieldAntecedente"/>}
                                        value={this.state.antecedent}
                                        onChange={this.handleChange('antecedent')}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="observations"
                                        label={<Translate id="languages.expedients.fieldObservaciones"/>}
                                        placeholder="Introduce aqui las observaciones que consideres pertinentes. Estas obserbaciones solo serán visisble para el estudio."
                                        value={this.state.observations}
                                        onChange={this.handleChange('observations')}
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
                                        onInput = {(e) =>{
                                            let aux = e.target.value;
                                            this.setState({observationsLength: aux.length});
                                            if(aux.length > 500)
                                                e.target.value = aux.slice(0,500)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <CatastralTable location={this.state.location} isShowAddress={this.state.isShowAddress}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AddressValidate isShowAddress={(show)=> {this.setState({isShowAddress: show})}}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button color="primary" className={classes.button} onClick={()=>{this.props.history.push("/")}}>
                                            {<Translate id="languages.generalButton.cancel"/>}
                                            <Clear className={classes.rightIcon}/>
                                        </Button>
                                        <Button variant="contained" color="primary" className={classes.button} onClick={()=>{this.handleSave()}} disabled={!this.state.isShowAddress}>
                                            {<Translate id="languages.expedients.btnGuardarExpediente"/>}
                                            <Check className={classes.rightIcon}/>
                                            {this.state.isSave && <CircularProgress size={24}/>}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Container>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(AddExpedient)));