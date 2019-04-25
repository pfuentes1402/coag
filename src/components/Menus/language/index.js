import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withCookies } from 'react-cookie';
import { withRouter } from "react-router-dom";
import { withLocalize } from "react-localize-redux";
import { IconButton, MenuList, MenuItem, Popper, Grow, Paper, ClickAwayListener } from '@material-ui/core';
import { Language } from "@material-ui/icons";


const styles = theme => ({
    button: {
        margin: theme.spacing.unit / 2,
    },
    paper: {
        marginRight: theme.spacing.unit * 2,
    }
});

class MenuLanguage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: true,
            open: false,
        };
    }

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };


    handleClose = () => {
        this.setState({ open: false });
    };


    handleClick(language) {
        let { setActiveLanguage } = this.props;
        setActiveLanguage(language)
        this.setState({ open: false });
    }

    render() {
        let { languages } = this.props;
        let { open } = this.state;

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
                    <Language />
                </IconButton>
                <Popper open={open} anchorEl={this.anchorEl} style={{ zIndex: 2 }} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        {languages.map(lang => (
                                            <MenuItem onClick={() => { this.handleClick(lang.code) }}>{lang.name}</MenuItem>
                                        ))}
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

MenuLanguage.propTypes = {
    classes: PropTypes.object,
};



export default withCookies(withRouter(withLocalize(withStyles(styles)(MenuLanguage))));
