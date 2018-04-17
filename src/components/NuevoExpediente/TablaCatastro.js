import React, { Component } from 'react';
import ComponentGrip from '../ComponentGrip';
import PropTypes from 'prop-types';

const propTypes = {
    data: PropTypes.array,
}

class TablaCatastro extends Component {
    render() {
        return (
                <ComponentGrip data={this.props.data}/>
        );
    }
}
TablaCatastro.propTypes = propTypes;
export default TablaCatastro;