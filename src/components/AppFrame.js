import React from 'react';
import PropTypes from 'prop-types';
import MenuAppBar from './MenuAppBar';
import MainContent from './../containers/MainContent';
import '../App.css';

const AppFrame = ({}) => {
    return (
        <div>
            <div className="app-frame">
                <MenuAppBar/>
                <MainContent/>
            </div>
        </div>
    );
};

AppFrame.propTypes = {
    header: PropTypes.string.isRequired,
};

export default AppFrame;