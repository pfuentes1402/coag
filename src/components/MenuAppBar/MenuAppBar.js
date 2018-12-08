import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";
import {Button, IconButton , MenuList, MenuItem, Popper, Grow, Paper, ClickAwayListener } from '@material-ui/core';
import { Container, Row, Col } from 'reactstrap';
import coag from './images/coag.jpg';
import './MenuAppBar.css';
import { connect } from 'react-redux';
import { purgarStore, goHome, goExpedientesUser } from './../../actions/usuarios/index';
import { fetchMuestraModal, fetchCambiaStatoModalBuscador,fetchCambiaStadoModal } from './../../actions/interfaz/index';
import { withLocalize, Translate } from 'react-localize-redux';
import menuBarTranslations from './../../traducciones/menubar.json'
import globalTranslations from './../../traducciones/global.json';
import { renderToStaticMarkup } from "react-dom/server";
import {Add, Settings, Search, Person} from "@material-ui/icons";
import persistor from "../../index";


const styles = theme => ({
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
    button: {
        margin: theme.spacing.unit / 2,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    paper: {
        marginRight: theme.spacing.unit * 2,
    },
    col: {
        alignSelf: "center"
    }
});

class MenuAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        auth: true,
        open: false,
    };
      this.props.addTranslation(menuBarTranslations);
        this.props.initialize({
          languages: [
            { name: "Castellano", code: "es" },
            { name: "Gallego", code: "gal" }
          ],
          translation: globalTranslations,
          options: { renderToStaticMarkup }
        });
  }

    
    handleLoggout(){
        localStorage.clear();
        persistor.purge();
        this.props.history.push('/');
    }

    handleHome = () =>{
      this.props.goHome();
        this.props.history.push('/');
    }

    handleMisexpe = () =>{
      this.props.goExpedientesUser();
        this.props.history.push('/');
    }


      handleBuscador(){
        this.props.fetchMuestraModal();
        this.props.fetchCambiaStatoModalBuscador();
        this.props.fetchCambiaStadoModal();
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
        const {classes} = this.props;
        let {open} = this.state;

        return (
            <Container className="full">
                <Row>
                    <Col xs={9} sm={9} md={4} lg={3} className={classes.col}>
                        <div><img src={coag} alt="logo" height="50" className="logo-coag"/></div>
                    </Col>
                    <Col xs={3} sm={3} md={2} lg={2} className={classes.col}>
                        <Button color="secondary" className={classes.button} onClick={()=>{this.props.history.push("/")}}>
                            <Translate id="menubar.Home">
                            </Translate>
                        </Button>
                    </Col>
                    <Col xs={10} sm={8} md={5} lg={5} className={classes.col}>
                        <div className="botonesBarra">
                            <Button variant="contained" color="primary" className={classes.button} onClick={()=>{this.props.history.push("/nuevo-expediente")}}>
                                    <Translate id="menubar.NewExpe">
                                    </Translate>
                                    <Add className={classes.rightIcon}/>

                            </Button>
                            <Button variant="outlined" color="secondary" className={classes.button}>
                                <Translate id="menubar.BatchRequest">
                                </Translate>
                                <Settings className={classes.rightIcon}/>
                            </Button>
                            <IconButton color="secondary" className={classes.button}
                                 onClick={()=>{this.handleBuscador()}}>
                                <Search/>
                            </IconButton>
                        </div>

                    </Col>
                    <Col xs={2} sm={4} md={1} lg={2} className={classes.col} style={{textAlign: "right"}}>
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
                    </Col>
                </Row>

            </Container>);
    }
}

MenuAppBar.propTypes = {
    classes: PropTypes.object,
};

const mapStateToProps = state => ({
      usuario: state.user.DatosUsuarioValidado.Usuario ? state.user.DatosUsuarioValidado.Usuario : 'Login',
     });
  
  const mapDispatchToProps = {
    purgarStore,
    goHome,
    goExpedientesUser,
    fetchMuestraModal,
    fetchCambiaStatoModalBuscador,
    fetchCambiaStadoModal,
  };
  

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(MenuAppBar))));
