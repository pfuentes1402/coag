import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";
import {Button, IconButton } from '@material-ui/core';
import { Container, Row, Col } from 'reactstrap';
import coag from './images/coag.jpg';
import './MenuAppBar.css';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';
import { Translate } from "react-localize-redux";
import {Add, Settings, Search} from "@material-ui/icons";
import MenuUser from "../Menus/user";
import MenuLanguage from "../Menus/language";
import { purgarStore, goHome, goExpedientesUser } from './../../actions/usuarios/index';
import { fetchMuestraModal, fetchCambiaStatoModalBuscador,fetchCambiaStadoModal } from './../../actions/interfaz/index';
import { CSSTransitionGroup } from 'react-transition-group'
import  Modalacciones  from '../../components/Home/Modalacciones';


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

      handleNav(uri){
          this.props.history.push(uri);
      }

    render() {
        let {classes} = this.props;

        return (
            <Container className="full">
                <Row>
                    <Col xs={9} sm={9} md={4} lg={3} className={classes.col}>
                        <div><img src={coag} alt="logo" height="50" className="logo-coag"/></div>
                    </Col>
                    <Col xs={3} sm={3} md={2} lg={2} className={classes.col}>
                        <Button color="secondary" className={classes.button} onClick={()=>{this.handleNav("/")}}>
                            <Translate id="languages.header.titleHome"/>
                        </Button>
                    </Col>
                    <Col xs={10} sm={8} md={5} lg={5} className={classes.col}>
                        <div className="botonesBarra">
                            <Button variant="contained" color="primary" className={classes.button} onClick={()=>{this.props.history.push("/nuevo-expediente")}}>
                                    <Translate id="languages.header.btnNewExpedient"/>
                                    <Add className={classes.rightIcon}/>

                            </Button>
                            <Button variant="outlined" color="secondary" className={classes.button}>
                                <Translate id="languages.header.btnTramitacionLote"/>
                                <Settings className={classes.rightIcon}/>
                            </Button>
                            <IconButton color="secondary" className={classes.button}
                                 onClick={()=>{this.handleBuscador()}}>
                                <Search/>
                            </IconButton>
                        </div>

                    </Col>
                    <Col xs={2} sm={4} md={1} lg={2} className={classes.col} >
                        <div style={{display: "flex", textAlign: "right"}}>
                            <MenuLanguage/>
                            <MenuUser/>
                        </div>
                    </Col>
                </Row>
                <div>
                    <CSSTransitionGroup
                        transitionName="acciones"
                        transitionEnterTimeout={3000}
                        transitionLeaveTimeout={3000}>
                        {
                            this.props.mostrarModal === true ?
                                <Modalacciones/>
                                : ''}
                    </CSSTransitionGroup>
                </div>
            </Container>);
    }
}

MenuAppBar.propTypes = {
    classes: PropTypes.object,
};

const mapStateToProps = state => (
    {
        usuario: state.user.DatosUsuarioValidado.Usuario ? state.user.DatosUsuarioValidado.Usuario : 'Login',
        mostrarModal: state.status.modalAcciones,
     }
     );
  
  const mapDispatchToProps = {
    purgarStore,
    goHome,
    goExpedientesUser,
    fetchMuestraModal,
    fetchCambiaStatoModalBuscador,
    fetchCambiaStadoModal,
  };
  

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(MenuAppBar))));
