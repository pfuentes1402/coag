import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import {Switch, Route} from 'react-router-dom';
import MainContainer from './containers/index';
import AddExpedient from "./components/NewExpedient/AddExpedient";
import Login from "./components/login/Login";
import Profile from "./components/Profile/Profile";
import ComunicacionEncargo from "./components/ComunicacionEncargo/index";
import SelectorTipoTrabajoContainer from "./containers/SelectorTipoTrabajoContainer";
import VisualizarExpediente from './components/VisualizarExpediente/index';

class Main extends Component {

    render(){

        return(
            <div>
                <Switch>
                    <Route exact path='/' component={(props) => <MainContainer {...props}/>} />
                    <Route exact path='/nuevo-expediente' component={(props) => <AddExpedient {...props}/>} />
                    <Route path='/login' component={(props) => <Login {...props}/> }/>
                    <Route path='/profile' component={(props) => <Profile {...props}/>}/>
                    <Route path='/selector-expediente' component={(props) => <SelectorTipoTrabajoContainer {...props}/>}/>
                    <Route exact path='/comunicacion/:id?' component={(props) => <ComunicacionEncargo {...props}/>}/>
                    <Route path="/visualizar-expediente/:id" component={(props) => <VisualizarExpediente {...props}/>}/>
                </Switch>
            </div>

        )
    }
}

export default withRouter(Main)