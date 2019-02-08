import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from "react-redux";
import {fetchErrorExpediente} from "../../actions/expedientes";
import {fetchErrorTrabajo} from "../../actions/trabajos";


const mapStateToProps = (state) => (
    {
        errorExpediente: state.expedientes.error && state.expedientes.error.MensajesProcesado ? state.expedientes.error.MensajesProcesado : [],
        errorTrabajo: state.trabajos.error && state.trabajos.error.MensajesProcesado ? state.trabajos.error.MensajesProcesado : [],
    }
);

const mapDispatchToProps = (dispatch) => {
    return {
        onErrorExpediente: (value) => dispatch(fetchErrorExpediente(value)),
        onErrorTrabajo: (value) => dispatch(fetchErrorTrabajo(value)),
    }
}

const styles = theme => ({
    close: {
        padding: theme.spacing.unit / 2,
    },
});

class ErrorSnackbars extends React.Component {

    handleClose = () => {
        let reset = {
            "MensajesProcesado": [ ]
            }
        this.props.onErrorExpediente(reset);
        this.props.onErrorTrabajo(reset)
    };


    render() {
        const { classes } = this.props;
        return (
            <div>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={this.props.errorExpediente.length >0 || this.props.errorTrabajo.length >0}
                    autoHideDuration={5000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{this.props.errorExpediente.length > 0 ? this.props.errorExpediente[0].Mensaje : (this.props.errorTrabajo.length >0 ? this.props.errorTrabajo[0].Mensaje: "")}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ErrorSnackbars));