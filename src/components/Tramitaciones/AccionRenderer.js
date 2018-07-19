import React, {Component} from "react";
import PropTypes from 'prop-types';

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
        alert("Id del trabajo: "+this.state.idTrabajo);
    }

    render() {
        return (
            <span><button style={{height: 20, lineHeight: 0.5}} onClick={this.invokeParentMethod} className="btn btn-info">{this.state.accionName}</button></span>
        );
    }
};
const propTypes = {
  data: PropTypes.array,
}

export default AccionRenderer;
