import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import coag from './coag.jpg';


class AppHeader  extends Component {


    render () {
    return (
        <div>
        <p>Hola</p>
        </div>
    );
}
}

AppHeader.propTypes = {
    title: PropTypes.string.isRequired,
};

export default withRouter(AppHeader);