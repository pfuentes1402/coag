import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {fetchFasesTrabajos, fetchTipoAutorizacion, fetchTipoTrabajo} from "../../actions/trabajos";
import {connect} from "react-redux";
import {FormControl, InputLabel, Select, MenuItem} from "@material-ui/core";
import {Container} from "reactstrap";

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
    formControl: {
        width: '100%'
    },
    margin: {
        marginTop: 30
    },
});

const mapStateToProps = (state) => (
    {
        trabajos: state.trabajos,
        tiposAutorizacion: state.trabajos.tiposAutorizacion.Tipos_autorizacion_municipal,
        fasesTrabajos: state.trabajos.fasesTrabajos.FasesTrabajos,
        loading:state.expedientes.loading
    }
);

const mapDispatchToProps =
    {
        fetchTipoTrabajo: fetchTipoTrabajo,
        fetchTipoAutorizacion: fetchTipoAutorizacion,
        fetchFasesTrabajos: fetchFasesTrabajos
    };

class ComunicacionEncargo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: null,
            obra: "",
        };

    };


    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    handleChangeSelect = event => {
        this.setState({obra: event.target.value });
    };

    render() {
        const { classes } = this.props;
        const { expanded } = this.state;

        return (
            <Container className={classes.margin}>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                       Obra
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-simple">Obra</InputLabel>
                            <Select
                                value={this.state.obra}
                                onChange={this.handleChangeSelect}
                                inputProps={{
                                    name: 'age',
                                    id: 'age-simple',
                                }}
                            >
                                {this.props.trabajos.tiposTrabajos.GruposTematicos.map(value => {
                                    return  <MenuItem value={value.Nombre}>{value.Nombre}</MenuItem>
                                })}

                            </Select>
                        </FormControl>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Container>
        );
    }
}

ComunicacionEncargo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ComunicacionEncargo));