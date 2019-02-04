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
import AsistenteTrabajo from './components/AsistenteTrabajo/index';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import {BreadcrumbsItem} from "react-breadcrumbs-dynamic";

class Main extends Component {
    render(){

        return(
            <div>

                <Switch>
                    <Route exact path='/' component={(props) => <MainContainer {...props}/>} />
                    <Route path='/login' component={(props) => <Login {...props}/> }/>
                    <Route exact path='/nuevo-expediente' component={(props) => <AddExpedient {...props}/>} />
                    <Route path='/profile' component={(props) => <Profile {...props}/>}/>
                    <Route path='/selector-expediente' component={(props) => <SelectorTipoTrabajoContainer {...props}/>}/>
                    <Route path="/visualizar-expediente/:id/:idTrabajo?/:idEstructura?" component={(props) => <VisualizarExpediente {...props}/>}/>
                    <Route path='/comunicacion/:id' component={(props) => <ComunicacionEncargo {...props}/>}/>
                    <Route path="/crear-trabajo/:id" component={(props) => <AsistenteTrabajo {...props}/>}/>
                </Switch>
            </div>

        )
    }
}

export default withRouter(withLocalize(Main));