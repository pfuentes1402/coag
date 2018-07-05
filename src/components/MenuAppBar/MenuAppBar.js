import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import { Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import coag from './images/coag.jpg';
import './MenuAppBar.css';
import { Route } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { purgarStore } from './../../actions/usuarios/index';
import { history } from '../../helpers/hidtory';

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
  }
    state = {
        auth: true,
        anchorEl: null,
    };
    handleMenu = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };
    handleLoggout = () =>{
      console.log("metodo de loggout")
      localStorage.removeItem('user');
      history.push('/');
    }
    

    render() {
        const {classes} = this.props;
        const {auth, anchorEl} = this.state;
        const open = Boolean(anchorEl);

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
          const ButtonHome = () => (
            <Route render={({ history}) => (
              <Button
                color="link"
                onClick={() => { history.push('/') }}
                variant="raised" className={classes.button}
              >
                Inicio
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
                //   onClick={() => { history.push('/') }}
                  onClick={this.handleLoggout}
                  variant="raised" className={classes.button}
                >
                  logout
                </Button>
                
                
              )} />
          )
        

        return (
            <Container className="full">
            <Row>
            <Col sm="3"><div><img src={coag} height="50" className="logo-coag"/></div></Col>
            <Col sm="2"><ButtonHome/><Button color="link">Mis expedientes</Button></Col>
            <Col sm="3">
                <ButtonNew/>{' '}
                <Button outline color="secondary">Tramitación en lote<FontAwesome name='rocket'/></Button>
            </Col>
            <Col sm="3">
                <Profile/>
                <Logout/>
                
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
  };
  

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MenuAppBar));
