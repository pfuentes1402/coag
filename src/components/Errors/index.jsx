import React from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from '@material-ui/core/styles';
import { Translate } from "react-localize-redux";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from "react-redux";
import { fetchErrorExpediente } from "../../actions/expedientes";
import { fetchErrorTrabajo } from "../../actions/trabajos";
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button } from "@material-ui/core";
import ReactQuill from "react-quill";

const mapStateToProps = (state) => {
    return {
        errorExpediente: loadErros(state.expedientes.error),
        errorTrabajo: loadErros(state.trabajos.error)
    }
}

function loadErros(error) {
    return error && error.MensajesProcesado ? error.MensajesProcesado : []
}

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
            "MensajesProcesado": []
        }
        this.props.onErrorExpediente(reset);
        this.props.onErrorTrabajo(reset)
    };


    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    open={this.props.errorExpediente.length > 0 || this.props.errorTrabajo.length > 0}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <Translate id="languages.generalButton.mensaje" />
                    </DialogTitle>
                    <DialogContent>
                        {this.props.errorExpediente.length > 0
                            && this.props.errorExpediente.map((error) => {
                                return <DialogContentText id="alert-dialog-description">
                                    <ReactQuill value={error.Mensaje} readOnly theme='bubble' />
                                </DialogContentText>
                            })}
                        {this.props.errorTrabajo.length > 0
                            && this.props.errorTrabajo.map((error) => {
                                return <DialogContentText id="alert-dialog-description">
                                    <ReactQuill value={error.Mensaje} readOnly theme='bubble' />
                                </DialogContentText>
                            })}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            <Translate id="languages.generalButton.aceptar" />
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(ErrorSnackbars)));