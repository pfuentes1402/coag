import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';

import './MenuAppBar/MenuAppBar.css';

const styles = {
    root: {
        flexGrow: 1,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class subBar extends React.Component {
    state = {
        auth: true,
        anchorEl: null,
    };


    render() {
        const {classes} = this.props;
        const {auth, anchorEl} = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <AppBar position="static" color="white">
                    <Toolbar>
                        <p>Hola</p>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

subBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(subBar);
