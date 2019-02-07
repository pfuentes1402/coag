import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";
import {IconButton , MenuList, MenuItem, Popper, Grow, Paper, ClickAwayListener } from '@material-ui/core';
import { connect } from 'react-redux';
import { Person} from "@material-ui/icons";
import persistor from "../../../index";


const styles = theme => ({
    button: {
        margin: theme.spacing.unit / 2,
    },
    paper: {
        marginRight: theme.spacing.unit * 2,
    }
});

class MenuUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: true,
            open: false,
        };
    }


    handleLoggout(){
        localStorage.clear();
        persistor.purge();
        this.props.history.push('/');
    }

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };


    handleClose = () => {
        this.setState({open: false });
    };

    handleNav(uri){
        this.setState({ open: false });
        this.props.history.push(uri);
    }

    render() {

        let {open} = this.state;

        return (
            <div>
                <IconButton color="secondary"
                            buttonRef={node => {
                                this.anchorEl = node;
                            }}
                            aria-owns={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleToggle}
                >
                    <Person/>
                </IconButton>
                <Popper open={open} anchorEl={this.anchorEl} style={{zIndex:2 }} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        <MenuItem onClick={()=> {this.handleNav("/profile")}}>{this.props.usuario }</MenuItem>
                                        <MenuItem  onClick={()=> {this.handleLoggout()}} >logout</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
            );
    }
}

MenuUser.propTypes = {
    classes: PropTypes.object,
};

const mapStateToProps = state => ({
    usuario: state.user.DatosUsuarioValidado.Usuario ? state.user.DatosUsuarioValidado.Usuario : 'Login',
});


export default withRouter(connect(mapStateToProps)(withStyles(styles)(MenuUser)));
