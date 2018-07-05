import React from 'react';
import PropTypes from 'prop-types';
import MenuAppBar from '../components/MenuAppBar/MenuAppBar';
import MainContent from '../components/MainContent/MainContent';

const AppHeader = ({}) => {
    return (
        <div>
            <div className="app-frame">
                <MenuAppBar/>
            </div>
        </div>
    );
};

export default AppHeader;