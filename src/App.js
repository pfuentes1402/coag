import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {Grid} from "@material-ui/core";
import AppHeader from "./containers/AppHeader";
import Main from "./Main";
import "./index.css"
const styles = theme => ({


});
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const {classes} = this.props;

        return (
            <Grid style={{width: '100%'}} >
                { this.props.history.location.pathname !== "/login" ?
                    <Grid item >
                        <AppHeader/>
                    </Grid>
                    : ""
                }

                <Grid item>
                    <Main/>
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(withStyles(styles)(App));
