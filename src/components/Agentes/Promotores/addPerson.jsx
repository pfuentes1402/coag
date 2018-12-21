import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Grid, FormControl, TextField, Typography, InputLabel, Select, MenuItem, InputAdornment, Input, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { getTipoPromotores, getPaises, getRegionesAutonoma, getProvincias, getConcellos } from '../../../api';
import { fetchErrorExpediente, formatMenssage } from "../../../actions/expedientes";
import { connect } from "react-redux";
import { grey } from '@material-ui/core/colors';
import Close from '@material-ui/icons/Close';

const styles = theme => ({
    formControl: {
        width: "70%"
    },
    label: {
        textTransform: "uppercase"
    },
    formControl2: {
        width: "70%",
        marginTop: 16,
        marginBottom: 8
    },
    divGrey: {
        backgroundColor: grey[100],
        padding: 16
    },
    button: {
        margin: theme.spacing.unit,
    },
})

const mapStateToProps = (state) => (
    {
        errorExpediente: state.expedientes.error && state.expedientes.error.MensajesProcesado ? state.expedientes.error.MensajesProcesado : [],
    }
);

const mapDispatchToProps = (dispatch) => {
    return {
        onErrorExpediente: (value) => dispatch(fetchErrorExpediente(value)),
    }
}

class AddPerson extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotor: this.props.promotor ? this.props.promotor : {
                "Id_Entidad": -1,
                "Nif": "",
                "Id_Tipo_Entidad": 1,
                "Nombre": "",
                "Apellido1": "",
                "Apellido2": "",
                "Observaciones": "",
                "Id_Tipo_Organismo": "",
                "Mail": "",
                "Telefono": "",
                "Calle": "",
                "Numero": "",
                "Piso": "",
                "Codigo_Postal": "",
                "porcentaje": null,
                "PorcentajesEquitativos": 1,
                "Id_Concello": "",
                "Id_Provincia": "",
                "Id_Autonomia": 71,
                "Id_Pais": 100,

            },
            tiposPromotor: [],
            domicilio: [],
            paises: [],
            regiones: [],
            provincias: [],
            municipios: [],
            checkedRepresentado: false,
            selectedRepresentados: [],
            checkedLey: true
        }
    }

    async componentWillMount() {
        let language = this.props.activeLanguage.code ? this.props.activeLanguage.code : null;
        try {
            if (language) {
                let tiposPromotor = await getTipoPromotores(language);
                let paises = await getPaises(language);
                let regiones = await getRegionesAutonoma(language);
                let provincias = await getProvincias(this.state.promotor.Id_Autonomia, language);
                this.setState({
                    tiposPromotor: tiposPromotor.data.Tipos_Promotores ? tiposPromotor.data.Tipos_Promotores : [],
                    paises: paises.data.AreasGeograficasPaises ? paises.data.AreasGeograficasPaises : [],
                    regiones: regiones.data.AreasGeograficasAutonomias ? regiones.data.AreasGeograficasAutonomias : [],
                    provincias: provincias.data.AreasGeograficasProvincias ? provincias.data.AreasGeograficasProvincias : []
                })
            }
        } catch (error) {
            this.props.onErrorExpediente(formatMenssage(error.message))
        }

    }

    handleChange = name => event => {
        let promotor = {};
        Object.assign(promotor, this.state.promotor);
        promotor[name] = event.target.value;
        this.setState({ promotor: promotor })
    };

    handlePorcentageChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };


    handleRegion = name => async event => {
        let promotor = {};
        let provincias = await getProvincias(event.target.value, this.props.activeLanguage.code);
        Object.assign(promotor, this.state.promotor);
        promotor[name] = event.target.value;
        this.setState({
            promotor: promotor,
            provincias: provincias.data.AreasGeograficasProvincias ? provincias.data.AreasGeograficasProvincias : [],
            municipios: []
        })
    };

    handleProvincias = name => async event => {
        let promotor = {};
        let municipios = await getConcellos(event.target.value, this.props.activeLanguage.code);
        Object.assign(promotor, this.state.promotor);
        promotor[name] = event.target.value;
        this.setState({
            promotor: promotor,
            municipios: municipios.data.AreasGeograficasConcellos ? municipios.data.AreasGeograficasConcellos : []
        })
    };

    handleSubmit() {

    }

    render() {
        let { classes } = this.props;
        let { tiposPromotor, paises, regiones, provincias, municipios } = this.state;
        return (
            <Grid container spacing={16}>
                <Grid item xs={12} >
                    <div className={classes.divGrey}>
                        <Typography variant="subtitle1" gutterBottom>
                            <Translate id="languages.agentes.titleDatosPersonales" />
                        </Typography>
                        <FormControl className={classes.formControl}>
                            <Translate>
                                {({ translate }) => <TextField
                                    required
                                    id="nif"
                                    label="Nif"
                                    placeholder={translate("languages.agentes.introduce") + "NIF"}
                                    value={this.state.promotor.Nif ? this.state.promotor.Nif : ""}
                                    onChange={this.handleChange('Nif')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.label
                                        }
                                    }}

                                />}
                            </Translate>

                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <Translate>
                                {({ translate }) => <TextField
                                    required
                                    id="nombre"
                                    label={translate("languages.agentes.tableColumnName")}
                                    placeholder={translate("languages.agentes.introduce") + " " + translate("languages.agentes.tableColumnName")}
                                    value={this.state.promotor.Nombre ? this.state.promotor.Nombre : ""}
                                    onChange={this.handleChange('Nombre')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.label
                                        }
                                    }}
                                    type="text"
                                />}
                            </Translate>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <Translate>
                                {({ translate }) => <TextField
                                    required
                                    id="apellido1"
                                    label={translate("languages.agentes.firstName")}
                                    placeholder={translate("languages.agentes.introduce") + " " + translate("languages.agentes.firstName")}
                                    value={this.state.promotor.Apellido1 ? this.state.promotor.Apellido1 : ""}
                                    onChange={this.handleChange('Apellido1')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.label
                                        }
                                    }}
                                    type="text"
                                />}
                            </Translate>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <Translate>
                                {({ translate }) => <TextField
                                    id="apellido2"
                                    label={translate("languages.agentes.secondName")}
                                    placeholder={translate("languages.agentes.introduce") + " " + translate("languages.agentes.secondName")}
                                    value={this.state.promotor.Apellido2 ? this.state.promotor.Apellido2 : ""}
                                    onChange={this.handleChange('Apellido2')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.label
                                        }
                                    }}
                                    type="text"
                                />}
                            </Translate>
                        </FormControl>
                    </div>
                    <div className="p-3">
                        <Typography variant="subtitle1" gutterBottom className="pb-3">
                            <Translate id="languages.agentes.titleCaracteristicasPromotor" />
                        </Typography>
                        <Grid container spacing={0}>
                            <Grid item xs={3}>
                                <FormControl style={{ width: "100%" }}>
                                    <InputLabel htmlFor="porciento" className={classes.label} shrink>
                                        <Translate id="languages.agentes.percentTitle" />
                                    </InputLabel>
                                    <Input
                                        id="porcentaje"
                                        placeholder="Ej 25"
                                        value={this.state.promotor.porcentaje ? this.state.promotor.porcentaje : ""}
                                        onChange={this.handleChange('porcentaje')}
                                        endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={9}>
                                <Translate>
                                    {({ translate }) => <FormControlLabel className="ml-0 mr-0"
                                        control={
                                            <Checkbox
                                                checked={this.state.promotor.PorcentajesEquitativos ? this.state.promotor.PorcentajesEquitativos : false}
                                                onChange={this.handleChange('PorcentajesEquitativos')}
                                                value="PorcentajesEquitativos"
                                                color="primary"
                                            />
                                        }
                                        label={translate("languages.agentes.percentLabel")}
                                    />}
                                </Translate>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={classes.divGrey}>
                        <Typography variant="subtitle1" gutterBottom className="pb-3">
                            <Translate id="languages.agentes.titleContacto" />
                        </Typography>
                        <FormControl className={classes.formControl}>
                            <Translate>
                                {({ translate }) => <TextField
                                    id="calle"
                                    required
                                    label={translate("languages.generalAddress.calle")}
                                    placeholder="Ej Gran via"
                                    value={this.state.promotor.Calle ? this.state.promotor.Calle : ""}
                                    onChange={this.handleChange('Calle')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.label
                                        }
                                    }}
                                    type="text"
                                />}
                            </Translate>
                        </FormControl>
                        <Grid container spacing={0} style={{ width: "70%" }} >
                            <Grid item xs={8}>
                                <FormControl style={{ width: 100 }}>
                                    <TextField
                                        id="Numero"
                                        label="Num"
                                        placeholder="Ej 25"
                                        value={this.state.promotor.Numero ? this.state.promotor.Numero : ""}
                                        onChange={this.handleChange('Numero')}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                            classes: {
                                                root: classes.label
                                            }
                                        }}
                                        type="number"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4} className="text-right">
                                <FormControl style={{ width: 100 }}>
                                    <Translate>
                                        {({ translate }) => <TextField
                                            id="Piso"
                                            label={translate("languages.generalAddress.piso")}
                                            placeholder="Ej 1A"
                                            value={this.state.promotor.Piso ? this.state.promotor.Piso : ""}
                                            onChange={this.handleChange('Piso')}
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                                classes: {
                                                    root: classes.label
                                                }
                                            }}
                                        />}
                                    </Translate>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl className={classes.formControl2}>
                            <InputLabel htmlFor="provincia" required shrink className={classes.label}>
                                <Translate id="languages.generalAddress.provincia" />
                            </InputLabel>
                            <Translate>
                                {({ translate }) => <Select
                                    value={this.state.promotor.Id_Provincia ? this.state.promotor.Id_Provincia : ""}
                                    onChange={this.handleProvincias('Id_Provincia')}
                                    inputProps={{
                                        name: 'provincia',
                                        id: 'provincia',
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        {translate("languages.agentes.selecciona") + " " +
                                            translate("languages.generalAddress.provincia")}
                                    </MenuItem>
                                    {
                                        provincias ?
                                            provincias.map(value => {
                                                return <MenuItem key={value.Id_Area} value={value.Id_Area}>{value.Nombre}</MenuItem>
                                            })
                                            : ""
                                    }
                                </Select>}
                            </Translate>
                        </FormControl>
                        <FormControl className={classes.formControl2}>
                            <InputLabel htmlFor="provincia" required shrink className={classes.label}>
                                <Translate id="languages.generalAddress.municipio" />
                            </InputLabel>
                            <Translate>
                                {({ translate }) => <Select
                                    value={this.state.promotor.Id_Concello ? this.state.promotor.Id_Concello : ""}
                                    onChange={this.handleChange('Id_Concello')}
                                    inputProps={{
                                        name: 'provincia',
                                        id: 'provincia',
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        {translate("languages.agentes.selecciona") + " " +
                                            translate("languages.generalAddress.municipio")}
                                    </MenuItem>
                                    {
                                        municipios ?
                                            municipios.map(value => {
                                                return <MenuItem key={value.Id_Area} value={value.Id_Area}>{value.Nombre}</MenuItem>
                                            })
                                            : ""
                                    }
                                </Select>}
                            </Translate>
                        </FormControl>
                        <FormControl className={classes.formControl2}>
                            <InputLabel htmlFor="pais" required shrink className={classes.label}>
                                <Translate id="languages.generalAddress.region" />
                            </InputLabel>
                            <Select
                                value={this.state.promotor.Id_Autonomia ? this.state.promotor.Id_Autonomia : ""}
                                onChange={this.handleRegion('Id_Autonomia')}
                                inputProps={{
                                    name: 'region',
                                    id: 'region',
                                }}
                            >
                                {
                                    regiones ?
                                        regiones.map(value => {
                                            return <MenuItem key={value.Id_Area} value={value.Id_Area}>{value.Nombre}</MenuItem>
                                        })
                                        : ""
                                }
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl2}>
                            <InputLabel htmlFor="pais" required shrink className={classes.label}>
                                <Translate id="languages.generalAddress.pais" />
                            </InputLabel>
                            <Select
                                value={this.state.promotor.Id_Pais ? this.state.promotor.Id_Pais : ""}
                                onChange={this.handleChange('Id_Pais')}
                                inputProps={{
                                    name: 'pais',
                                    id: 'pais',
                                }}

                            >
                                {
                                    paises ?
                                        paises.map(value => {
                                            return <MenuItem key={value.Id_Area} value={value.Id_Area}>{value.Nombre}</MenuItem>
                                        })
                                        : ""
                                }
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <Translate>
                                {({ translate }) => <TextField
                                    id="mail"
                                    label={translate("languages.agentes.titleCorreo")}
                                    placeholder={translate("languages.agentes.introduce") + " " + translate("languages.agentes.titleCorreo")}
                                    value={this.state.promotor.Mail ? this.state.promotor.Mail : ""}
                                    onChange={this.handleChange('Mail')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.label
                                        }
                                    }}
                                    type="email"
                                />}
                            </Translate>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <Translate>
                                {({ translate }) => <TextField
                                    id="telefono"
                                    label={translate("languages.agentes.titleTelefono")}
                                    placeholder={translate("languages.agentes.introduce") + " " + translate("languages.agentes.titleTelefono")}
                                    value={this.state.promotor.Telefono ? this.state.promotor.Telefono : ""}
                                    onChange={this.handleChange('Telefono')}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                        classes: {
                                            root: classes.label
                                        }
                                    }}
                                    type="email"
                                />}
                            </Translate>
                        </FormControl>
                    </div>
                    <div className="p-3">
                        <Translate>
                            {({ translate }) => <FormControlLabel className="ml-0 mr-0"
                                control={
                                    <Checkbox
                                        checked={this.state.checkedRepresentado}
                                        onChange={this.handlePorcentageChange('checkedRepresentado')}
                                        value="checkedPercentage"
                                        color="primary"
                                    />
                                }
                                label={translate("languages.agentes.titleRepresentadoA")}
                            />}
                        </Translate>
                        <FormControl className={classes.formControl}>
                            <Translate>
                                {({ translate }) => <Select
                                    value={this.state.selectedRepresentados ? this.state.selectedRepresentados : ""}
                                    onChange={this.handleChange('selectedRepresentados')}
                                    inputProps={{
                                        name: 'representado',
                                        id: 'representado',
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        {translate("languages.agentes.selecciona") + " " +
                                            translate("languages.agentes.promotor")}
                                    </MenuItem>
                                </Select>}
                            </Translate>
                        </FormControl>
                    </div>
                    <div className={classes.divGrey}>
                        <Translate>
                            {({ translate }) => <FormControlLabel className="ml-0 mr-0 align-items-start text-justify"
                                control={
                                    <Checkbox
                                        checked={this.state.checkedLey}
                                        onChange={this.handlePorcentageChange('checkedLey')}
                                        value="checkedLey"
                                        color="primary"
                                    />
                                }
                                label={translate("languages.agentes.textLeyOrganica")}
                            />}
                        </Translate>
                    </div>
                    <div className="p-3 text-right">
                        <Button color="primary" size="small" className={classes.button}>
                            <Translate id="languages.generalButton.cancel" />
                            <Close className={classes.rightIcon} />
                        </Button>
                        <Button variant="contained" size="small" color="primary" className={classes.button}
                            disabled={!this.state.checkedLey} onClick={() => { this.props.onAddPerson(this.state.promotor) }}>
                            <Translate id="languages.generalButton.addedSave" />
                        </Button>
                    </div>
                </Grid>

            </Grid>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(AddPerson)));