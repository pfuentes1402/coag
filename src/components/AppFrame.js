import React from 'react';
import PropTypes from 'prop-types';
import MenuAppBar from './MenuAppBar/MenuAppBar';
import MainContent from './../containers/MainContent';
import '../App.css';

const AppFrame = ({}) => {
    return (
        <div>
            <div className="app-frame">
                <MenuAppBar/>
            </div>
        </div>
    );
};

AppFrame.propTypes = {
    header: PropTypes.string.isRequired,
};

export default AppFrame;