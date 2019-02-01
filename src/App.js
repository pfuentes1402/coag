import React, { Component } from 'react';
import {NavLink,Link, withRouter} from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import globalTranslations from "./resources.json";
import { renderToStaticMarkup } from "react-dom/server";
import {Grid, Typography} from "@material-ui/core";
import AppHeader from "./containers/AppHeader";
import Main from "./Main";
import "./index.css";
import Error from "./components/Errors";
import {connect} from "react-redux";
import {Breadcrumbs} from "react-breadcrumbs-dynamic";
import {blue} from '@material-ui/core/colors';
import {Breadcrumb as BootstrapBreadcrumb} from "reactstrap";

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
                    <Grid >
                        <AppHeader/>
                        <Breadcrumbs
                            separator={<b style={{padding: 6}}> // </b>}
                            item={Link}
                            finalItem={Typography}
                            finalProps={{
                                style: {fontWeight: 500}
                            }}
                            container={BootstrapBreadcrumb}
                            containerProps={{style: {
                                    display: "flex",
                                    borderRadius: 0,
                                    height: 47,
                                    alignItems: "center",
                                    fontStyle: "italic",
                                    position: "fixed",
                                    width: "100%",
                                    paddingLeft: 32,
                                    zIndex: 1,
                                    color: blue[500]
                          }}}
                        />
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
