import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import MainContainer from './containers/index';
import { connect} from 'react-redux';
import { history } from './helpers/hidtory';
import routes from './routes';

import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import 'typeface-roboto';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    history.listen((location, action) => {
      
    
    });
}

  
  render() {
    return (
            // <Router history={history}>
            <Router>
                {routes}
            </Router>


       
    


    );
  }
}
App.propTypes = {
};

const mapDispatchToProps= dispatch =>({
});

export default connect(null, mapDispatchToProps)(App);
