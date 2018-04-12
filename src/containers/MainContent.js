import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import MenuAppBar from './../components/MenuAppBar';
import subBar from '../components/SubBar';
import TreeDocuments from "../components/TreeDocuments";

class MainContent extends Component {
    render() {
        return (
                <div><p>http://servicios.coag.es/api/EstructuraDocumental/702181/2</p>
                    <TreeDocuments/>
                </div>
        );
    }
}

MainContent.propTypes = {};

export default MainContent;
