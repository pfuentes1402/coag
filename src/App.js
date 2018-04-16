import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import MainContainer from './containers/index';
import HomeContainer from './containers/HomeContainer';
import NuevoExpedienteContainer from './containers/NuevoExpedienteContainer';
import { connect} from 'react-redux';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import {setDummy} from "./actions";
import 'typeface-roboto';
import './App.css';
import compDummyContainer from "./components/compDummyContainer";


class App extends Component {
    constructor(){
        super();
        this.state = {dummy: 'gol'}
    }
    handleOnclicktest (e) {
            //e.preventDefault();
        console.log(this.state.valueDummy);
        this.setState({dummy:'text'});
        let nValue = 'Nuevo valor';
        this.props.dummy(nValue);
    }
  render() {
    return (
            <Router>
                <div>
                    <MainContainer />
                    <Switch>
                        <Route exact path='/' component={HomeContainer}/>
                        <Route path='/nuevo-expediente' component={NuevoExpedienteContainer}/>
                    </Switch>
                </div>
            </Router>
    );
  }
}
App.propTypes = {
    dummy: PropTypes.func.isRequired
};

const mapDispatchToProps= dispatch =>({
   dummy : value => dispatch(setDummy(value))
});

export default connect(null, mapDispatchToProps)(App);
