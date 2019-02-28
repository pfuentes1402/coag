import React from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from '@material-ui/core/styles';
import { Translate } from "react-localize-redux";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from "react-redux";
import {fetchErrorExpediente} from "../../actions/expedientes";
import {fetchErrorTrabajo} from "../../actions/trabajos";
import {Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button} from "@material-ui/core";
import ReactQuill from "react-quill";

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
                <Dialog
                    open={this.props.errorExpediente.length >0 || this.props.errorTrabajo.length >0}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <Translate id="languages.generalButton.mensaje"/>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <ReactQuill value={this.props.errorExpediente.length > 0 ? this.props.errorExpediente[0].Mensaje : (this.props.errorTrabajo.length >0 ? this.props.errorTrabajo[0].Mensaje: "")} readOnly theme='bubble' />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            <Translate id="languages.generalButton.aceptar"/>
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(ErrorSnackbars)));