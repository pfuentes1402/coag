import React, { Component } from "react";
import { Edit } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

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
    }

    render() {
        return (
            <span>
                <IconButton style={
                    {
                        border: "2px solid",
                        padding: "6px", margin: "4px"
                    }} aria-label="Edit" color="primary">
                    <Edit />
                </IconButton >
            </span>
        );
    }
};

export default AccionRenderer;
