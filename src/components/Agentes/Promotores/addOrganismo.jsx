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
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

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
        padding: 16,
        borderBottom: "1px solid #eee",
        borderTop: "1px solid #eee"
    },
    button: {
        margin: theme.spacing.unit,
    },
    readOnly: {
        pointerEvents: "none",
        opacity: 0.5
    },
    panelExapnded: {
        border: '1.2px solid ' + theme.palette.primary.main,
        margin: '0',
        minHeight: 42
    }
})

const mapStateToProps = (state) => (
    {
        errorExpediente: state.expedientes.error && state.expedientes.error.MensajesProcesado ? state.expedientes.error.MensajesProcesado : [],
        selectedPromoters: state.expedientes.promotores,
    }
);

const mapDispatchToProps = (dispatch) => {
    return {
        onErrorExpediente: (value) => dispatch(fetchErrorExpediente(value)),
    }
}

class AddOrganismo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotor: this.props.promotor ? this.props.promotor : {
                "Id_Entidad": -1,
                "Nif": "",
                "Id_Tipo_Entidad": 2,
                "Nombre": "",
                "Apellido1": "",
                "Apellido2": "",
                "Observaciones": "",
                "Mail": "",
                "Telefono": "",
                "Calle": "",
                "Numero": "",
                "Piso": "",
                "Codigo_Postal": "",
                "porcentaje": null,
                "PorcentajesEquitativos": 1,
                "Id_Concello": "",
                "Id_Provincia": 15,
                "Id_Autonomia": 71,
                "Id_Pais": 100,
                "Nif_Representado": ""
            },
            tiposPromotor: [],
            domicilio: [],
            paises: [],
            regiones: [],
            provincias: [],
            municipios: [],
            checkedRepresentado: false,
            selectedRepresentados: [],
            checkedLey: true,
            expanded: false,
            flag: this.props.promotor
        };

    }

    componentDidMount() {
        if (this.element)
            this.element.scrollIntoView({ behavior: 'smooth', block: "start" });
    }

    async componentWillMount() {
        let language = this.props.activeLanguage.code ? this.props.activeLanguage.code : null;
        try {
            if (language) {
                let tiposPromotor = await getTipoPromotores(language);
                let paises = await getPaises(language);
                let regiones = await getRegionesAutonoma(language);
                let provincias = await getProvincias(this.state.promotor.Id_Autonomia, language);
                let municipios = await getConcellos(this.state.promotor.Id_Provincia, language);
                this.setState({
                    tiposPromotor: tiposPromotor.data.Tipos_Promotores ? tiposPromotor.data.Tipos_Promotores : [],
                    paises: paises.data.AreasGeograficasPaises ? paises.data.AreasGeograficasPaises : [],
                    regiones: regiones.data.AreasGeograficasAutonomias ? regiones.data.AreasGeograficasAutonomias : [],
                    provincias: provincias.data.AreasGeograficasProvincias ? provincias.data.AreasGeograficasProvincias : [],
                    municipios: municipios.data.AreasGeograficasConcellos ? municipios.data.AreasGeograficasConcellos : [],
                    expanded: this.state.promotor.Id_Entidad === -1
                })
            }
        } catch (error) {
            this.props.onErrorExpediente(formatMenssage(error.message))
        }

    }

    handleChange = (name, checkedProperty = false) => event => {
        let promotor = {};
        Object.assign(promotor, this.state.promotor);
        if (!checkedProperty)
            promotor[name] = event.target.value;
        else {
            promotor[name] = event.target.checked ? 1 : 0;
        }
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
        await this.setState({
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
        await this.setState({
            promotor: promotor,
            municipios: municipios.data.AreasGeograficasConcellos ? municipios.data.AreasGeograficasConcellos : []
        })
    };

    handleSubmit() {
        this.props.onAddOrganismo(this.state.promotor);
    }

    render() {
        let { classes } = this.props;
        let { paises, regiones, provincias, municipios } = this.state;
        return (
            <div ref={element => { this.element = element; }}>
                <ValidatorForm
                    ref="form"
                    onSubmit={() => { this.handleSubmit() }}>
                    <Grid container spacing={16}>
                        <Grid item xs={12} >

                            <div className={`p-3 ${this.props.readOnly && classes.readOnly}`}>
                                <Typography variant="subtitle1" gutterBottom>
                                    <Translate id="languages.agentes.titleDatosOrganismo" />
                                </Typography>
                                <FormControl className={classes.formControl}>
                                    <Translate>
                                        {({ translate }) => <TextValidator
                                            name="cif"
                                            id="cif"
                                            label="Nif *"
                                            placeholder={`${translate("languages.agentes.introduce")}  CIF`}
                                            value={this.state.promotor.Nif ? this.state.promotor.Nif : ""}
                                            onChange={this.handleChange('Nif')}
                                            margin="normal"
                                            InputLabelProps={{
                                                shrink: true,
                                                classes: {
                                                    root: classes.label
                                                }
                                            }}
                                            validators={['required']}
                                            errorMessages={[translate("languages.generalText.fieldRequired")]}
                                            disabled={this.state.promotor && this.state.promotor.Id_Entidad !== -1}
                                        />}
                                    </Translate>

                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <Translate>
                                        {({ translate }) => <TextValidator
                                            id="nombre"
                                            name="nombre"
                                            label={translate("languages.agentes.tableColumnName") + " *"}
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
                                            validators={['required']}
                                            errorMessages={[translate("languages.generalText.fieldRequired")]}
                                        />}
                                    </Translate>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <Translate>
                                        {({ translate }) => <TextField
                                            id="observations"
                                            label={translate("languages.agentes.observations")}
                                            placeholder={translate("languages.agentes.introduce") + " " + translate("languages.agentes.observations")}
                                            value={this.state.promotor.Observaciones ? this.state.promotor.Observaciones : ""}
                                            onChange={this.handleChange('Observaciones')}
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
                            <div className={classes.divGrey}>
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
                                                disabled={this.state.promotor.PorcentajesEquitativos === 1}
                                                placeholder="Ej 25"
                                                value={this.state.promotor.porcentaje}
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
                                                        checked={this.state.promotor.PorcentajesEquitativos === 1}
                                                        onChange={this.handleChange('PorcentajesEquitativos', true)}
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

                            {/**Contactos */}
                            <ExpansionPanel style={{ boxShadow: "none" }} className="m-0" expanded={this.state.expanded}>
                                <ExpansionPanelSummary expandIcon={<ExpandMore color={this.state.expanded ? "primary" : "default"} />}
                                    style={{ minHeight: 48, height: 48, padding: 16 }}
                                    className={`${this.state.expanded && classes.panelExapnded}`}
                                    onClick={() => this.setState({ expanded: !this.state.expanded })}>
                                    <Typography variant="subtitle1">
                                        <Translate id="languages.agentes.titleContacto" />
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails className="p-0">
                                    <div className={`p-3 ${this.props.readOnly && classes.readOnly}`}>
                                        <FormControl className={classes.formControl}>
                                            <Translate>
                                                {({ translate }) => <TextValidator
                                                    name="calle"
                                                    id="calle"
                                                    label={translate("languages.generalAddress.calle") + " *"}
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
                                                    validators={['required']}
                                                    errorMessages={[translate("languages.generalText.fieldRequired")]}
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
                                            <InputLabel htmlFor="provincia" required shrink className={classes.label} style={{ transform: "translate(0, -12.5px) scale(0.75)" }}>
                                                <Translate id="languages.generalAddress.provincia" />
                                            </InputLabel>
                                            <Translate>
                                                {({ translate }) => <SelectValidator
                                                    name="provincia"
                                                    value={this.state.promotor.Id_Provincia ? this.state.promotor.Id_Provincia : ""}
                                                    onChange={this.handleProvincias('Id_Provincia')}
                                                    inputProps={{
                                                        name: 'provincia',
                                                        id: 'provincia',
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={[translate("languages.generalText.fieldRequired")]}
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
                                                </SelectValidator>}
                                            </Translate>
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <InputLabel htmlFor="concello" required shrink className={classes.label} style={{ transform: "translate(0, -12.5px) scale(0.75)" }}>
                                                <Translate id="languages.generalAddress.municipio" />
                                            </InputLabel>
                                            <Translate>
                                                {({ translate }) => <SelectValidator
                                                    name="concello"
                                                    value={this.state.promotor.Id_Concello ? this.state.promotor.Id_Concello : ""}
                                                    onChange={this.handleChange('Id_Concello')}
                                                    inputProps={{
                                                        name: 'concello',
                                                        id: 'concello',
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={[translate("languages.generalText.fieldRequired")]}
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
                                                </SelectValidator>}
                                            </Translate>
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <InputLabel htmlFor="pais" required shrink className={classes.label} style={{ transform: "translate(0, -12.5px) scale(0.75)" }}>
                                                <Translate id="languages.generalAddress.region" />
                                            </InputLabel>
                                            <Translate>
                                                {({ translate }) => <SelectValidator
                                                    name="Id_Autonomia"
                                                    value={this.state.promotor.Id_Autonomia ? this.state.promotor.Id_Autonomia : ""}
                                                    onChange={this.handleRegion('Id_Autonomia')}
                                                    inputProps={{
                                                        name: 'region',
                                                        id: 'region',
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={[translate("languages.generalText.fieldRequired")]}
                                                >
                                                    {
                                                        regiones ?
                                                            regiones.map(value => {
                                                                return <MenuItem key={value.Id_Area} value={value.Id_Area}>{value.Nombre}</MenuItem>
                                                            })
                                                            : ""
                                                    }
                                                </SelectValidator>}
                                            </Translate>
                                        </FormControl>
                                        <FormControl className={classes.formControl2}>
                                            <InputLabel htmlFor="pais" required shrink className={classes.label} style={{ transform: "translate(0, -12.5px) scale(0.75)" }}>
                                                <Translate id="languages.generalAddress.pais" />
                                            </InputLabel>
                                            <Translate>
                                                {({ translate }) => <SelectValidator
                                                    name="Id_Pais"
                                                    value={this.state.promotor.Id_Pais ? this.state.promotor.Id_Pais : ""}
                                                    onChange={this.handleChange('Id_Pais')}
                                                    inputProps={{
                                                        name: 'pais',
                                                        id: 'pais',
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={[translate("languages.generalText.fieldRequired")]}
                                                >
                                                    {
                                                        paises ?
                                                            paises.map(value => {
                                                                return <MenuItem key={value.Id_Area} value={value.Id_Area}>{value.Nombre}</MenuItem>
                                                            })
                                                            : ""
                                                    }
                                                </SelectValidator>}
                                            </Translate>
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
                                                    type="tel"
                                                />}
                                            </Translate>
                                        </FormControl>
                                    </div>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                            <div className={`${classes.divGrey} ${this.props.readOnly && classes.readOnly}`}>
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
                                            value={this.state.promotor.Nif_Representado ? this.state.promotor.Nif_Representado : ""}
                                            onChange={this.handleChange('Nif_Representado')}
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
                                            {
                                                this.props.selectedPromoters ? this.props.selectedPromoters.map(value => {
                                                    return <MenuItem key={value.Nif} value={value.Nif}>{value.Nombre}</MenuItem>
                                                })
                                                    : ""
                                            }
                                        </Select>}
                                    </Translate>
                                </FormControl>
                            </div>
                            <div className={`p-3 ${this.props.readOnly && classes.readOnly}`}>
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
                                <Button color="primary" size="small" className={classes.button} onClick={() => { this.props.onCancelPromotor() }}>
                                    <Translate id="languages.generalButton.cancel" />
                                    <Close className={classes.rightIcon} />
                                </Button>
                                <Button type="submit" variant="contained" size="small" color="primary" className={classes.button}
                                    disabled={!this.state.checkedLey}>
                                    {this.props.readOnly ?
                                        <Translate id="languages.generalButton.editSave" />
                                        : <Translate id="languages.generalButton.addedSave" />
                                    }
                                </Button>
                            </div>

                        </Grid>

                    </Grid>
                </ValidatorForm>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(AddOrganismo)));