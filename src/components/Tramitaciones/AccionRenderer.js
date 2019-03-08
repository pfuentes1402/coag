import React, { Component } from "react";
import { Edit, Notifications, RemoveRedEye, FileCopy, Check, 
    ArrowDownwardSharp , Input, EditSharp} from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles/index";
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

    renderActions = () => {
        let { classes } = this.props;
        switch (this.props.data.Id_Estado) {
            //Borrador
            case 0:
                return <div>
                    <span>
                        <IconButton className={classes.buttonAction} aria-label="View" color="primary">
                            <EditSharp />
                        </IconButton >
                    </span>
                </div>;
            //En Tramitación - Presentado
            case 1:
                return <div>
                    <span>
                        <IconButton className={classes.buttonAction} aria-label="View" color="primary">
                            <RemoveRedEye />
                        </IconButton >
                    </span>
                    <span>
                        <IconButton className={classes.buttonAction} aria-label="View" color="primary">
                            <Notifications />
                        </IconButton >
                    </span>
                </div>;
            //En Tramitación - Pendente Modificacións
            case 2:
                return null;
            //Tramitado
            case 3:
                return <div>
                    <span>
                        <IconButton className={classes.buttonAction} aria-label="View" color="primary">
                            <FileCopy />
                        </IconButton >
                    </span>
                </div>;
            //Tramitado - Pendente retirada
            case 4:
            return <div>
            <span>
                <IconButton className={classes.buttonAction} aria-label="View" color="primary">
                    <Input />
                </IconButton >
            </span>
        </div>;
            //Tramitado - Retirado
            case 5:
                return null;
        }
    }

    render() {
        return (
            <div>{this.renderActions()}</div>
        );
    }
};

export default withStyles(styles)(AccionRenderer)