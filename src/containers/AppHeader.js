import React from 'react';
import MenuAppBar from '../components/MenuAppBar/MenuAppBar';
import SubHeader from '../components/SubHeader/SubHeader';



const AppHeader = ({}) => {
    return (
        <div>
            <div className="app-frame">
                <MenuAppBar/>
            </div>
            
            <SubHeader title=''/>  
        </div>
    );
};

export default AppHeader;