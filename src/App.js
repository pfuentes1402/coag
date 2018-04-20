import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import MainContainer from './containers/index';
import { connect} from 'react-redux';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import 'typeface-roboto';
import './App.css';


class App extends Component {
  render() {
    return (
            <Router>
                <div>
                    <MainContainer />
                    <Switch>
                    </Switch>
                </div>
            </Router>
    );
  }
}
App.propTypes = {
};

const mapDispatchToProps= dispatch =>({
});

export default connect(null, mapDispatchToProps)(App);
