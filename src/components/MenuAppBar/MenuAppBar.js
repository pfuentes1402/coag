import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import { Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import coag from './images/coag.jpg';
import './MenuAppBar.css';
import { Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { purgarStore, goHome, goExpedientesUser } from './../../actions/usuarios/index';
import { fetchMuestraModal, fetchCambiaStatoModalBuscador,fetchCambiaStadoModal } from './../../actions/interfaz/index';
import { history } from '../../helpers/hidtory';
import { handleLoggout } from '../../helpers/logout';
import {  UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import { withLocalize, Translate } from 'react-localize-redux';
import menuBarTranslations from './../../traducciones/menubar.json'
import LanguageToggle from '../ToggleLanguage/LanguageToggle';
import globalTranslations from './../../traducciones/global.json';
import { renderToStaticMarkup } from "react-dom/server";

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

class MenuAppBar extends React.Component {
  constructor(props) {
    super(props);
   this.props.addTranslation(menuBarTranslations);
    
    this.handleLoggout = this.handleLoggout.bind(this);
    this.handleHome = this.handleHome.bind(this);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };

    this.props.initialize({
      languages: [
        { name: "Castellano", code: "es" },
        { name: "Gallego", code: "gal" }          
      ],
      translation: globalTranslations,
      options: { renderToStaticMarkup }
    });
  }
    state = {
        auth: true,
        anchorEl: null,
    };
    
    handleLoggout = () =>{
    
      localStorage.clear();
      this.props.purgarStore();
      history.push('/');
    }
    handleHome = () =>{
     
      this.props.goHome();
      history.push('/');
    }
    handleMisexpe = () =>{
          
      this.props.goExpedientesUser();
      history.push('/');
    }

    toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleBuscador=()=>{
    this.props.fetchMuestraModal();
    this.props.fetchCambiaStatoModalBuscador();
    this.props.fetchCambiaStadoModal();
  }

    render() {
        const {classes} = this.props;
        // const {auth, anchorEl} = this.state;
        // const open = Boolean(anchorEl);

        const ButtonNew = () => (
            <Route render={({ history}) => (
              <Button
                onClick={() => { history.push('/nuevo-expediente') }}
                variant="raised" color="primary" className={classes.button}
              
              >
              <Translate id="menubar.NewExpe">                  
              </Translate>
              </Button>
            )} />
          )
       
        const ButtonBuscador = () => (
            <Route render={({ history}) => (
              <Button
                onClick={ this.handleBuscador}
                variant="raised" color="primary" className={classes.button}              
              >
                <FontAwesomeIcon icon="search" />
              </Button>
            )} />
          )
       
          const ButtonHome = () => (
            <Route render={({ history}) => (
              <Button
                color="link"
                onClick={this.handleHome}
                variant="raised" className={classes.button}
              >
                <Translate id="menubar.Home">                  
              </Translate>
              </Button>
            )} />
          )
       
          const ButtonMisexpe = () => (
            <Route render={({ history}) => (
              <Button
                color="link"
                onClick={this.handleMisexpe}
                variant="raised" className={classes.button}
              >
               <Translate id="menubar.expedients">                  
              </Translate>
                
              </Button>
            )} />
          )
          const Profile = () => (
            <Route render={({ history}) => (
                <Button
                  color="link"
                  onClick={() => { history.push('/profile') }}
                  variant="raised" className={classes.button}
                >
                  { this.props.usuario }
                </Button>
                
                
              )} />
          )
          const Logout = () => (
            <Route render={({ history}) => (
                <Button
                  color="link"
                
                  onClick={handleLoggout}
                  
                  variant="raised" className={classes.button}
                >
                  logout
                </Button>
                
                
              )} />
          )
        

        return (
         
            <Container className="full">
            <Row>
            <Col sm="3"><div><img src={coag} alt="logo" height="50" className="logo-coag"/></div></Col>
            
            <Col sm="2"><ButtonHome/></Col>
            <Col sm="3" className="botonesBarra">
            <div>
                <ButtonNew  className="botones"/>
                <Button outline color="secondary">
                  <Translate id="menubar.BatchRequest">               
                  </Translate>
                </Button>
                <ButtonBuscador  className="botones"/>
                </div>
            </Col>
           
            <Col sm="3" className="dropMenu">           
            <div>
            
            </div>
            <div >
            <UncontrolledDropdown nav inNavbar tag={'div'}>
                <DropdownToggle nav caret  >
                <Translate id="menubar.profile">                  
              </Translate>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                  <Profile/>
                  <DropdownItem divider />
                  </DropdownItem>
                  <DropdownItem>
                  <Logout/>
                  </DropdownItem>                           
                  </DropdownMenu>
              </UncontrolledDropdown>
              </div>
            </Col>
            <LanguageToggle/>
            </Row>
           
            </Container>







           
        );
    }
}

MenuAppBar.propTypes = {
    classes: PropTypes.object,
};

const mapStateToProps = state => ({
    
      usuario: state.user.DatosUsuarioValidado.Usuario || 'Login',
      
     });
  
  
  const mapDispatchToProps = {
    
    purgarStore,
    goHome,
    goExpedientesUser,
    fetchMuestraModal,
    fetchCambiaStatoModalBuscador,
    fetchCambiaStadoModal,
  };
  

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(MenuAppBar)));
