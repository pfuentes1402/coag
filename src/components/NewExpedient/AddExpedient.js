import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField, FormControl, Button, CircularProgress, Snackbar, IconButton } from '@material-ui/core';
import { Check, Clear, Close } from '@material-ui/icons'
import { Container } from "reactstrap";
import { validateAddress, saveAdressTostore, updateAddress, fetchErrorExpediente } from '../../actions/expedientes';
import { postNuevoExpediente } from '../../api';
import { connect } from 'react-redux';
import CatastralTable from "./CatastralTable";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import AddressValidate from "../Address";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { some, findIndex } from 'lodash';
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
        catastro: state.expedientes.addressreducida ? state.expedientes.addressreducida : [], /*Contiene arreglo de la tabla de ubicaciones */
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
            location: null,
            alias: '',
            catastro: [],
            linksMaps: [],
            emplazamientos: [],
            isValidate: false,
            isShowAddress: false,
            alert: false,
            msg: "",
            observationsLength: 0,
            isSave: false,
            validate: false,
            allowAdd: false,
            key: 0
        };

    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleCanAdd(canAdd) {
        this.setState({ allowAdd: canAdd });
    }

    async handleSave() {
        if (!this.state.title || !this.state.codeStudy || (this.state.observationsLength > 0 && this.state.observationsLength < 110)) {
            this.setState({ alert: true, msg: (!this.state.title && !this.state.codeStudy) ? "El título y el código de estudio son obligatorios" : (!this.state.title ? "El título es obligatorio" : (!this.state.codeStudy ? "El código de estudio es obligatorio" : "Las observaciones requieren más de 110 caracteres")) })
        }
        else {
            this.setState({ isSave: true });
            let fechaEntrada = new Date();
            fechaEntrada = fechaEntrada.toISOString();
            let expediente = {
                'Fecha_Entrada': fechaEntrada,
                'Titulo': this.state.title,
                'Expediente_Codigo_Estudio': this.state.codeStudy,
                'Antecedente': this.state.antecedent,
                'Observaciones': this.state.observations,
                'Emplazamientos': this.state.emplazamientos,
                'IgnorarObservaciones': 1
            }
            let response = await postNuevoExpediente(expediente);
            this.setState({ isSave: false });
            if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                this.props.fetchErrorExpediente(response);
            }
            else {

                this.props.history.push("/comunicacion/" + response.Expediente[0].Id_Expediente);
            }

        }

    }

    handleClose = () => {
        this.setState({ alert: false });
    };

    handleUpdateIsShowAddress(showAddress) {
        this.setState({ isShowAddress: showAddress });
    }

    async handleUpdateLocation(location) {
        /*if(this.state.emplazamientos.some(x=> x.Georeferencia === location.Georeferencia)){
            let index = this.state.emplazamientos.findIndex(x=> x.Georeferencia === location.Georeferencia);
            let copy = Object.assign([], this.state.emplazamientos);
            copy[index] = location;
            await this.setState({ location: location, emplazamientos: copy});
            return;
        }*/
        await this.setState({ location: location });
    }


    handleUpdateEmplazamientos(emplazamientos) {
        this.setState({ emplazamientos: emplazamientos });
    }

    async handleDeleteAddress(emplazamientos) {
        await this.setState({ emplazamientos: emplazamientos });
    }

    async handleSaveAddress() {
        let { location, emplazamientos } = this.state;
        let locations = [];
        Object.assign(locations, emplazamientos);
        let equal = this.ifEqual(emplazamientos, location);
        if (equal === -1) {
            locations.push(location);
        }
        else {
            locations[equal] = location;
        }

        await this.setState({ emplazamientos: locations });
        this.handleUpdateEmplazamientos(locations);
    }

    ifEqual(data, address) {
        let equal = some(data, address);
        let index = -1;
        if (equal) {
            index = findIndex(data, address);
        }
        return index;
    }

    render() {
        let { classes } = this.props;
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
                <BreadcrumbsItem to={'/nuevo-expediente'} >
                    <Translate id="languages.breadcrumb.nuevoExpediente" />
                </BreadcrumbsItem>
                <Grid container spacing={8}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={24}>
                            <Grid item xs={12} md={6} className={classes.divider}>

                                <FormControl className={classes.formControl1}>
                                    <TextField
                                        id="code"
                                        label={<Translate id="languages.expedients.fieldCodigoExpediente" />}
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
                                        label={<Translate id="languages.expedients.fieldCodigoEstudio" />}
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
                                        label={<Translate id="languages.expedients.fieldTitleExp" />}
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
                                        label={<Translate id="languages.expedients.fieldAntecedente" />}
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
                                        label={<Translate id="languages.expedients.fieldObservaciones" />}
                                        placeholder="Introduce aqui las observaciones que consideres pertinentes. Estas obserbaciones solo serán visisble para el estudio."
                                        value={this.state.observations}
                                        onChange={this.handleChange('observations')}
                                        margin="normal"
                                        multiline
                                        rows={4}

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
                                        onInput={(e) => {
                                            let aux = e.target.value;
                                            this.setState({ observationsLength: aux.length });
                                            if (aux.length > 500)
                                                e.target.value = aux.slice(0, 500)
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <CatastralTable location={this.state.location} emplazamientos={this.state.emplazamientos}
                                            saveAddress={async () => {
                                                this.setState({ key: Math.random() });
                                                this.handleUpdateIsShowAddress(false);
                                                this.handleCanAdd(true);
                                            }}
                                            deleteAddress={async (emplazamientos) => { await this.handleDeleteAddress(emplazamientos) }}
                                            isShowAddress={this.state.isShowAddress} />
                                    </Grid>

                                    {this.state.allowAdd && <Grid item xs={12}>
                                        <AddressValidate updateLocation={async (location) => { await this.handleUpdateLocation(location) }}
                                            isShowAddress={this.state.isShowAddress}
                                            validate={async () => await this.handleSaveAddress()}
                                            updateIsShowAddress={(showAddress) => { this.handleUpdateIsShowAddress(showAddress) }}
                                            location={this.state.location}
                                            key={this.state.key} />
                                    </Grid>}

                                    {this.state.allowAdd && <Grid item xs={12} className="text-right">
                                        <Button color="primary" size="small" className={`mx-2`}
                                            onClick={() => { this.handleCanAdd(false) }}>
                                            <Translate id="languages.generalButton.cancel" /><Close className={classes.rightIcon} />
                                        </Button>
                                        <Button variant="contained" size="small" color="primary"
                                            className={classes.button} 
                                            disabled={!this.state.location || !this.state.isShowAddress}
                                            onClick={async () => { await this.handleSaveAddress(); }}>
                                            <Translate id="languages.generalButton.added" />
                                        </Button>
                                    </Grid>}

                                    <Grid item xs={12} style={{ textAlign: "right" }}>
                                        <Button color="primary" className={classes.button} onClick={() => { this.props.history.push("/") }}>
                                            {<Translate id="languages.generalButton.cancel" />}
                                            <Clear className={classes.rightIcon} />
                                        </Button>
                                        <Button variant="contained" color="primary" className={classes.button}
                                            onClick={() => { this.handleSave() }}
                                            disabled={this.state.emplazamientos.length === 0}>
                                            <Translate id="languages.expedients.btnGuardarExpediente" />
                                            <Check className={classes.rightIcon} />
                                        </Button>
                                        {this.state.isSave && <CircularProgress size={24} />}
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