import React from 'react';
import MenuAppBar from '../components/MenuAppBar/MenuAppBar';
import SubHeader from '../components/SubHeader/SubHeader';
import BreadCrumb from '../components/BreadCrumb/index';
const AppHeader = ({ }) => {
    return (
        <div>
            <div className="app-frame" style={{ boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)" }}>
                <MenuAppBar />
            </div>
            <div className="app-frame"
                style={{ boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)", background:"white" }}>
                <BreadCrumb/>
            </div>
            <SubHeader title='' />
        </div>
    );
};

export default AppHeader;