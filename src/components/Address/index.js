import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, TextField, FormControl,  Tooltip, CircularProgress, Fab} from '@material-ui/core';
import {Check} from '@material-ui/icons'
import {validateAddress, saveAdressTostore, updateAddress } from '../../actions/expedientes';
import { connect } from 'react-redux';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";

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
        updateAddress: updateAddress

    };


class ValidateAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: '',
            alias: '',
            catastro: [],
            linksMaps: [],
            locations: [],
            emplacement: [],
            isValidate: false,
            isShowAddress: false,
            alert: false,
            isSave: false
        };

    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleChangeAddress(name, event) {
        let address = {...this.props.addressData};
        if(address && address.Datos_Completos[0]){
            if (address.Datos_Completos[0][name] !== event.target.value ) {
                address.Datos_Completos[0][name] = event.target.value;
                this.props.updateAddress(address);
            }
        }
    };

    async handleValidateAddress(){
        await this.setState({isValidate: true});
        try {
            await this.props.validateAddress(this.state.location);
            let errors = this.props.error;
            if(errors.length > 0){
                await this.setState({isValidate: false, isShowAddress:  false});
                this.props.isShowAddress(false);
            }else {
                await this.saveAddress();
                await this.setState({isValidate: false, isShowAddress:  true});
                this.props.isShowAddress(true);
            }
        }
        catch (e) {
            this.setState({ alert: false, msg: e.message });
        }
    }

    saveAddress(){
        let address = this.props.addressData ? this.props.addressData.Datos_Completos[0] : [];
        if (!this.ifEqual(this.props.catastro, address)) {
            this.props.saveAdressTostore(address, this.props.location);
        }
    }

    ifEqual(data, address){
        let equal = false;
        if (data.length > 0) {
            data.map(value => {
                if (value.Calle === address.Calle && value.Numero === address.Numero && value.Piso === address.Piso && value.Codigo_Postal === address.Codigo_Postal && value.municipio === address.Concello) {
                    equal = true
                }
            })
        }
        return equal;
    }

    render() {
        let {classes} = this.props;
        let data = this.props.addressData.Datos_Completos[0];
        return (
            <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <FormControl className={classes.formControl1}>
                                <TextField
                                    id="location"
                                    helperText={<Translate id="languages.expedients.helperTextAddressValidate"/>}
                                    value={this.state.location}
                                    onChange={this.handleChange('location')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}

                                />
                            </FormControl>
                            <Tooltip title={<Translate id="languages.generalButton.validate"/>}>
                                <Fab size="small"  color="primary" aria-label="Check" className={classes.button} disabled={!this.state.location || this.state.isValidate}
                                     onClick={()=>{this.handleValidateAddress()}}>
                                    <Check/>
                                </Fab>
                            </Tooltip>
                            {this.state.isValidate && <CircularProgress size={24}/>}
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        {
                            this.state.isShowAddress ?
                                <Grid container spacing={16}>
                                    <Grid item xs={12}>
                                        <FormControl className={classes.formControl2}>
                                            <TextField
                                                label="Calle"
                                                value={data && data.Calle ? data.Calle : ""}
                                                onChange={(event)=>{this.handleChangeAddress('Calle', event)}}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}

                                            />
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <TextField
                                                id="num"
                                                label="NUM"
                                                value={data && data.Numero ? data.Numero : ""}
                                                onChange={(event)=>{this.handleChangeAddress('Numero', event)}}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <TextField
                                                id="PISO"
                                                label="PISO"
                                                value={data && data.Piso ? data.Piso : ""}
                                                onChange={(event)=>{this.handleChangeAddress('Piso', event)}}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <TextField
                                                id="CP"
                                                label="CODIGO POSTAL"
                                                value={data && data.Codigo_Postal ? data.Codigo_Postal : ""}
                                                onChange={(event)=>{this.handleChangeAddress('Codigo_Postal', event)}}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <TextField
                                                id="municipio"
                                                label="MUNICIPIO"
                                                value={data && data.Concello ? data.Concello : ""}
                                                onChange={(event)=>{this.handleChangeAddress('Concello', event)}}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <TextField
                                                id="provincia"
                                                label="PROVINCIA"
                                                value={data && data.Provincia ? data.Provincia : ""}
                                                onChange={(event)=>{this.handleChangeAddress('Provincia', event)}}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <TextField
                                                id="REGION"
                                                label="REGION"
                                                value={data && data.REGION ? data.REGION : ""}
                                                onChange={(event)=>{this.handleChangeAddress('REGION', event)}}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <TextField
                                                id="pais"
                                                label="PAIS"
                                                value={data && data.Pais ? data.Pais : ""}
                                                onChange={(event)=>{this.handleChangeAddress('Pais', event)}}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl className={classes.formControl1}>
                                            <TextField
                                                id="alias"
                                                label={<Translate id="languages.expedients.fieldAliasDireccion"/>}
                                                placeholder="Ej C/Numancia No 13"
                                                value={this.state.alias}
                                                onChange={this.handleChange('alias')}
                                                margin="normal"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                helperText={<Translate id="languages.expedients.helperTextAliasDireccion"/>}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                : ""
                        }
                    </Grid>
                </Grid>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(ValidateAddress)));