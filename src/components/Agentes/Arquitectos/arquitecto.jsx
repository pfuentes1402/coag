import React, { Component } from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { Typography, Grid, Paper, Button, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';
import UserIcon from '@material-ui/icons/SupervisedUserCircle';
import Close from '@material-ui/icons/Close';

const styles = theme => ({
  resultPanel: {
    padding: "20px 30px"
  },
  subtitleData: {
    marginTop: 10,
    fontWeight: "normal"
  },
  usericon: {
    margin: theme.spacing.unit,
    fontSize: 150,
  },
  mt0: {
    marginTop: -10
  },
  button: {
    margin: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  }
});

class FormArquitecto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arquitecto: this.props.arquitecto
    }
    if (this.element)
      this.element.scrollIntoView({ behavior: 'smooth', block: "start" });
  }

  componentWillMount() {
    this.initSelectedProperties();
  }

  componentDidMount() {
    this.element.scrollIntoView({ behavior: 'smooth', block: "start" });
  }

  initSelectedProperties() {
    let arquitect = {};
    Object.assign(arquitect, this.state.arquitecto);
    if (!arquitect.Funciones) {
      arquitect["Funciones"] = [];
      arquitect["Porciento"] = 0;
      arquitect["percentChecked"] = true;
      arquitect["acceptTerm1"] = false;
      arquitect["acceptTerm2"] = false;
      this.setState({ arquitecto: arquitect });
    }
  }

  notifyPropertyChange = (propertyName) => event => {
    let newArquitect = {};
    Object.assign(newArquitect, this.state.arquitecto);
    switch (propertyName) {
      case "Porciento":
        newArquitect[propertyName] = event.target.value;
        this.setState({ arquitecto: newArquitect });
        break;

      case "Funciones":
        let tag = event.target.tagName === "SPAN" ? event.target.parentNode : event.target;
        let functionCode = event.target.tagName === "SPAN"
          ? event.target.textContent
          : event.target.firstChild.textContent;

        if (!this.state.arquitecto.Funciones.some(x => x === functionCode)) {
          newArquitect.Funciones.push(functionCode);
          tag.className = tag.className + " slectedFunction";
          this.setState({ arquitecto: newArquitect });
        }
        else {
          newArquitect.Funciones = newArquitect.Funciones.filter(x => x !== functionCode);
          tag.className = tag.className.replace("slectedFunction", "");
          this.setState({ arquitecto: newArquitect });
        }
        break;

      default:
        newArquitect[propertyName] = event.target.checked;
        this.setState({ arquitecto: newArquitect });
        break;
    }
  }

  render() {
    let value = this.props.arquitecto;
    let { classes } = this.props;
    return (
      <div ref={element => { this.element = element; }}>
        <Grid item xs={12} >
          <Paper className={classes.resultPanel}>
            <Grid container spacing={24}>
              <Grid item xs={8}>
                <Typography variant="h6" gutterBottom>
                  <Translate id="languages.agentes.arquitectDataTitle" />
                </Typography>
                <Typography variant="body2" className={classes.subtitleData}>NIF</Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Nif}</Typography>

                <Typography variant="body2" className={classes.subtitleData}>
                  <Translate id="languages.agentes.tableColumnName" />
                </Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Nombre}</Typography>

                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                  <Translate id="languages.agentes.firstName" />
                </Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Apellido1}</Typography>

                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                  <Translate id="languages.agentes.secondName" />
                </Typography>
                <Typography variant="subtitle2" gutterBottom>{value.Apellido2}</Typography>

                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                  <Translate id="languages.agentes.observations" />
                </Typography>
                <Typography variant="subtitle2" gutterBottom></Typography>
              </Grid>

              <Grid item xs={4}>
                <UserIcon className={classes.usericon} color="secondary" />
              </Grid>

              <Grid item xs={12} className="functionTipology">
                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                  <Translate id="languages.agentes.functionsTitle" /> *
              </Typography>
                {
                  this.props.funcionesTipologia.map((valueTiplogia, indexCode) => {
                    return <Button onClick={this.notifyPropertyChange("Funciones")}
                      className={this.state.arquitecto.Funciones.some(x => x === valueTiplogia.Codigo) ? "slectedFunction" : ""}
                      variant="contained"
                      key={indexCode}>{valueTiplogia.Codigo}
                    </Button>
                  })
                }
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" className={`${classes.subtitleData} text-uppercase`}>
                  <Translate id="languages.agentes.percentTitle" />
                </Typography>
                <Grid container spacing={0}>
                  <Grid item xs={5}>
                    <TextField
                      label="%"
                      className={classes.mt0}
                      value={this.state.arquitecto.Porciento}
                      placeholder="Ej 25"
                      type="number"
                      onChange={this.notifyPropertyChange("Porciento")}
                      margin="normal" />
                  </Grid>
                  <Grid item xs={7}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.arquitecto.percentChecked}
                          onChange={this.notifyPropertyChange("percentChecked")}
                          color="primary" />
                      }
                      label={<Translate id="languages.agentes.percentLabel" />} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {!this.state.arquitecto.acceptTerm1 || !this.state.arquitecto.acceptTerm2
                  ? <Typography variant="caption" gutterBottom color="error" className="ml-3 pl-3">
                    <Translate id="languages.agentes.termsValidation" /> *
                  </Typography> : ""}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.arquitecto.acceptTerm1}
                      onChange={this.notifyPropertyChange("acceptTerm1")}
                      color="primary" />
                  }
                  label={<Translate id="languages.agentes.conditionTermn1" />} />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.arquitecto.acceptTerm2}
                      onChange={this.notifyPropertyChange("acceptTerm2")}
                      color="primary" />
                  }
                  label={<Translate id="languages.agentes.conditionTermn2" />} />
              </Grid>

              <Grid item xs={12} className="text-right">
                <Button color="primary" size="small" className={classes.button}
                  onClick={() => { this.props.handleCanSearch(false) }}>
                  <Translate id="languages.generalButton.cancel" /><Close className={classes.rightIcon} />
                </Button>
                <Button variant="contained" size="small" color="primary" className={classes.button}
                  onClick={() => this.props.addAgenteTrabajoToSelection(this.state.arquitecto)}
                  disabled={this.state.arquitecto.acceptTerm1 && this.state.arquitecto.acceptTerm2
                    && this.state.arquitecto.Funciones.length > 0
                    && (this.state.arquitecto.Porciento !== "" || this.state.arquitecto.percentChecked) ? false : true}>
                  {this.props.existAgentSelected(this.state.arquitecto.Id_Colegiado)
                    ? <Translate id="languages.generalButton.save" />
                    : <Translate id="languages.generalButton.added" />}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

};

FormArquitecto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(FormArquitecto)));