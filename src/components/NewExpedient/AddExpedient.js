import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Paper, Grid, TextField, FormControl, Button, Tooltip, CircularProgress, Fab } from '@material-ui/core';
import {Check, Clear} from '@material-ui/icons'
import {Container} from "reactstrap";
import {validateAddress, postUbicacion, saveAdressTostore, updateAddress } from '../../actions/expedientes';
import { connect } from 'react-redux';
import CatastralTable from "./CatastralTable";
import {Alert} from "reactstrap";

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
});

const mapStateToProps = (state) => (
     {
         addressData: state.expedientes.address ? state.expedientes.address : '',
         catastro: state.expedientes.addressreducida ? state.expedientes.addressreducida: [], /*Contiene arreglo de la tabla de ubicaciones */
     }
);

const mapDispatchToProps =
     {
        validateAddress: validateAddress,
        postUbicacion: postUbicacion,
        saveAdressTostore: saveAdressTostore,
        updateAddress: updateAddress

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
            observationsLength: 0
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
        }
        catch (e) {
            console.log("prueba")
        }

        await setTimeout(async()=> {
            await this.setState({isValidate: false, isShowAddress:  true});
            },2000);
        await this.saveAddress();

    }

    saveAddress(){
        let address = this.props.addressData.Datos_Completos[0];
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

    handleSave(){
        if(!this.state.title || !this.state.codeStudy || (this.state.observationsLength > 0 && this.state.observationsLength < 110)){
            this.setState({alert: true, msg: (!this.state.title && !this.state.codeStudy) ? "El título y el código de estudio son obligatorios" : (!this.state.title ? "El título es obligatorio" : (!this.state.codeStudy ? "El código de estudio es obligatorio" : "Las observaciones requieren más de 110 caracteres"))})
        }
        else {
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
            this.props.postUbicacion(expediente);
            this.props.history.push("/");
        }

    }

    onDismiss() {
        this.setState({ alert: false });
    }

    render() {
        let {classes} = this.props;
        let data = this.props.addressData.Datos_Completos[0];
        return (
            <Container className={classes.margin}>
                <Alert color="danger" isOpen={this.state.alert} toggle={()=>{this.onDismiss()}} fade={false}>
                    {this.state.msg}
                </Alert>
                <Grid container spacing={8}>
                    <Paper className={classes.paper}>
                        <Grid container spacing={24}>
                            <Grid item xs={12} md={6} className={classes.divider}>
                                <FormControl className={classes.formControl1}>
                                    <TextField
                                        id="code"
                                        label="CODIGO EXPEDIENTE"
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
                                        label="CODIGO ESTUDIO"
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
                                        label="TITULO DEL EXPEDIENTE"
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
                                        label="ANTECEDENTE"
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
                                        label="OBSERVACIONES"
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
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <FormControl className={classes.formControl1}>
                                                <TextField
                                                    id="location"
                                                    helperText="La dirección se proporciona automáticamente"
                                                    value={this.state.location}
                                                    onChange={this.handleChange('location')}
                                                    margin="normal"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}

                                                />
                                            </FormControl>
                                            <Tooltip title="Validar">
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
                                                            label="ALIAS DIRECCION"
                                                            placeholder="Ej C/Numancia No 13"
                                                            value={this.state.alias}
                                                            onChange={this.handleChange('alias')}
                                                            margin="normal"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            helperText="Introducir un Alias para la dirección"
                                                        />
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            : ""
                                    }
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button color="primary" className={classes.button} onClick={()=>{this.props.history.push("/")}}>
                                            Cancelar
                                            <Clear className={classes.rightIcon}/>
                                        </Button>
                                        <Button variant="contained" color="primary" className={classes.button} onClick={()=>{this.handleSave()}} disabled={!this.state.isShowAddress}>
                                            Guardar y crear expediente
                                            <Check className={classes.rightIcon}/>
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


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddExpedient));