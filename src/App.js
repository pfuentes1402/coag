import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import globalTranslations from "./resources.json";
import { renderToStaticMarkup } from "react-dom/server";
import {Grid} from "@material-ui/core";
import AppHeader from "./containers/AppHeader";
import Main from "./Main";
import "./index.css";
import Error from "./components/Errors";
import {connect} from "react-redux";

const mapStateToProps = state => ({
    idiomaFavorito: state.user.DatosConfiguracionesUsuario.Idioma_Predefinido,

});
const styles = theme => ({


});
class App extends Component {
    constructor(props) {
        super(props);

        this.props.initialize({
            languages: [
                { name: "Castellano", code: "1" },
                { name: "Gallego", code: "2" }
            ],
            translation: globalTranslations,
            options: { renderToStaticMarkup,
                defaultLanguage: this.props.idiomaFavorito.toString() }
        });
    }

    componentWillMount(){
        let {setActiveLanguage} = this.props;
        setActiveLanguage(this.props.idiomaFavorito.toString())
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
                <Grid>
                    <Error/>
                </Grid>
            </Grid>
        );
    }
}

export default withRouter(connect(mapStateToProps)(withLocalize(withStyles(styles)(App))));
