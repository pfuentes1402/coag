import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, TextField, FormControl,  Tooltip, CircularProgress, Fab} from '@material-ui/core';
import {Check} from '@material-ui/icons';
import { fetchErrorExpediente, formatMenssage } from '../../actions/expedientes';
import { connect } from 'react-redux';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import {getValidateAddress} from "../../api";

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

    }
);

const mapDispatchToProps =
    {
        fetchErrorExpediente: fetchErrorExpediente
    };


class ValidateAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            alias: '',
            catastro: [],
            linksMaps: [],
            locations: [],
            emplacement: [],
            isValidate: false,
            isShowAddress: false,
            alert: false,
            isSave: false,
            data: {},
        };

    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleChangeAddress(name, event) {
        let data = {};
        let aux = this.props.isShowAddress ? this.props.location : this.state.data;
        Object.assign(data, aux);
        data[name] = event.target.value;
        this.setState({data: data});
        this.props.updateLocation(data);

    };

    async handleValidateAddress(){
        this.setState({isValidate: true});
        try {
            let response = await getValidateAddress(this.state.location);
            if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                await this.props.fetchErrorExpediente(response);
                await this.setState({isValidate: false, isShowAddress:  false});
                await this.props.updateIsShowAddress(false);
            }
            else {
                await this.setState({data: response.Datos_Completos ? response.Datos_Completos[0] : [], isValidate: false, isShowAddress:  true});
                await this.props.updateLocation(response.Datos_Completos ? response.Datos_Completos[0] : []);
                await this.props.updateIsShowAddress(true);
                await this.props.validate();
            }
        }
        catch (e) {
            await this.props.fetchErrorExpediente(formatMenssage(e.message));
            await this.setState({isValidate: false, isShowAddress: false});
        }

    }

    render() {
        let {classes} = this.props;
        let data = this.props.isShowAddress ? this.props.location : this.state.data;
        //let georeferencia = this.props.isShowAddress ? this.props.location.Georeferencia : this.state.location;
        let georeferencia = this.state.location;
        return (
            <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <FormControl className={classes.formControl1}>
                                <TextField
                                    id="location"
                                    helperText={<Translate id="languages.expedients.helperTextAddressValidate"/>}
                                    value={georeferencia}
                                    onChange={this.handleChange('location')}
                                    margin="normal"
                                    placeholder="Ref catastral o coordenadas UTM"
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
                            this.state.isShowAddress || this.props.isShowAddress  ?
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
                                                value={data && data.Autonomia ? data.Autonomia : ""}
                                                onChange={(event)=>{this.handleChangeAddress('Autonomia', event)}}
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