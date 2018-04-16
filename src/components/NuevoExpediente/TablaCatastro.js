import React, { Component } from 'react';
import ComponentGrip from '../ComponentGrip';
import PropTypes from 'prop-types';

const propTypes = {
    data: PropTypes.string.isRequired,
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