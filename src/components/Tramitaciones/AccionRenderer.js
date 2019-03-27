import React, { Component } from "react";
import {
    Edit, Notifications, RemoveRedEye, FileCopy, Check,
    ArrowDownwardSharp, Input, EditSharp, Send, EditAttributes
} from '@material-ui/icons';
import { IconButton, Tooltip } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles/index";
import { connect } from 'react-redux';

const styles = theme => ({
    buttonAction: {
        border: "2px solid",
        padding: "4px", margin: "4px"
    }
});

class AccionRenderer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accionName: this.props.value,
            idTrabajo: this.props.data.Id_Trabajo
        }
        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }

    invokeParentMethod() {
        alert("Id del trabajo: " + this.state.idTrabajo);
        return;
    }

    getActions(stringActions) {
        return stringActions ? stringActions.split(",") : []
    }

    getWorkActions() {
        try {
            return this.props.accionesTrabajos.filter(x => x.Id_Expediente === this.props.data.Id_Expediente
                && x.Id_Trabajo === this.props.data.Id_Trabajo);
        } catch(e){
            return [];
        }
    }

    renderActions = (action) => {
        let { classes } = this.props;
        switch (action.Id_Accion) {
            //Borrador
            case 0:
                return <span>
                    <Tooltip title={action.Nombre}>
                        <IconButton disabled={true} className={classes.buttonAction} aria-label="View" color="primary">
                            <EditSharp />
                        </IconButton >
                    </Tooltip>
                </span>;
            //En Tramitación - Presentado
            case 1:
                return <span>
                    <Tooltip title={action.Nombre}>
                        <IconButton disabled={true} className={classes.buttonAction} aria-label="View" color="primary">
                            <Notifications />
                        </IconButton >
                    </Tooltip>
                </span>;
            //En Tramitación - Pendente Modificacións
            case 2:
                return <span></span>;
            //Tramitado
            case 3:
                return <span>
                    <Tooltip title={action.Nombre}>
                        <IconButton disabled={true} className={classes.buttonAction} aria-label="View" color="primary">
                            <FileCopy />
                        </IconButton >
                    </Tooltip>
                </span>;
            //Tramitado - Pendente retirada
            case 4:
                return <span>
                    <Tooltip title={action.Nombre}>
                        <IconButton disabled={true} className={classes.buttonAction} aria-label="View" color="primary">
                            <Input />
                        </IconButton >
                    </Tooltip>
                </span>;
            //Tramitado - Retirado
            case 5:
                return <span></span>;
            case 6:
                return <span></span>;
            case 7:
                return <span></span>;
            case 8:
                return <span></span>;
            case 9:
                return <span></span>;
            //Entregar
            case 10:
                return <span>
                    <Tooltip title={action.Nombre}>
                        <IconButton disabled={true} className={classes.buttonAction} aria-label="View" color="primary">
                            <Notifications />
                        </IconButton >
                    </Tooltip>
                </span>;
            //Modificar entrega
            case 11:
                return <span>
                    <Tooltip title={action.Nombre}>
                        <IconButton disabled={true} className={classes.buttonAction} aria-label="View" color="primary">
                            <Edit />
                        </IconButton >
                    </Tooltip>
                </span>;
            //Solicitar modificar entrega
            case 12:
                return <span>
                    <Tooltip title={action.Nombre}>
                        <IconButton disabled={true} className={classes.buttonAction} aria-label="View" color="primary">
                            <EditAttributes />
                        </IconButton >
                    </Tooltip>
                </span>;
            //Retirar
            case 18:
                return <span>
                    <Tooltip title={action.Nombre}>
                        <IconButton disabled={true} className={classes.buttonAction} aria-label="View" color="primary">
                            <Input />
                        </IconButton >
                    </Tooltip>
                </span>;
            default:
                return <span></span>;
        }
    }

    render() {
        return (
            <div style={{}}>
                {this.getWorkActions().map(element => { return this.renderActions(element) })}
            </div>
        );
    }
};

const mapStateToProps = state => ({
    accionesTrabajos: state.user.ultimostrabajos ? state.user.ultimostrabajos.Acciones : [],
});

export default connect(mapStateToProps)(withStyles(styles)(AccionRenderer));