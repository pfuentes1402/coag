import React, {Component} from 'react';
import PropTypes from 'prop-types';


const dummyComponent = ({ dummy }) => (
    <div>
        <h1>Test</h1>
        <h2>{dummy}</h2>

    </div>
);

dummyComponent.propTypes = {
    dummy: PropTypes.string,
};

export default dummyComponent ;
