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

import { history } from '../../helpers/hidtory';
import { handleLoggout } from '../../helpers/logout';
import {  UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem, NavItem } from 'reactstrap';

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
    // Don't call this.setState() here!
    
    this.handleLoggout = this.handleLoggout.bind(this);
    this.handleHome = this.handleHome.bind(this);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
    state = {
        auth: true,
        anchorEl: null,
    };
    
    handleLoggout = () =>{
      console.log("metodo de loggout")
     
      localStorage.clear();
      this.props.purgarStore();
      history.push('/');
    }
    handleHome = () =>{
      console.log("metodo de Home")
     
      
      this.props.goHome();
      history.push('/');
    }
    handleMisexpe = () =>{
      console.log("metodo de handleMisexpe")
     
      
      this.props.goExpedientesUser();
      history.push('/');
    }

    toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleBuscador=()=>{
    
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
                Nuevo expediente
              </Button>
            )} />
          )
       
        const ButtonBuscador = () => (
            <Route render={({ history}) => (
              <Button
                onClick={() => { this.handleBuscador}}
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
                Inicio
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
                Mis expedientes
              </Button>
            )} />
          )
          const Profile = () => (
            <Route render={({ history}) => (
                <Button
                  color="link"
                  onClick={() => { history.push('/login') }}
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
            
            <Col sm="2"><ButtonHome/><ButtonMisexpe/></Col>
            <Col sm="3">
                <ButtonNew/>
                <Button outline color="secondary">Tramitación en lote</Button>
                <ButtonBuscador/>
            </Col>
           
            <Col sm="3">           
           
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Perfil
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
            
            </Col>
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
    
  };
  

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuAppBar));
