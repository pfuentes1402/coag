import React, { Component } from 'react';
import { Container } from "reactstrap";
import Arquitecto from './Arquitectos';
import Promotores from './Promotores';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';

const styles = theme => ({
  margin: {
    marginTop: 30
  },
  titleMainPanel: {
    borderBottom: '1.5px solid ' + grey[100],
  },
  marginPanel: {
    margin: '15px 0px'
  }
});

class Agentes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { classes } = this.props;
    return (
      <Container className={classes.margin}>
        <Grid item xs={12} className="min-height-panel">
          <ExpansionPanel expanded={true}>
            <ExpansionPanelSummary style={{ minHeight: 48, height: 48 }}
              className={classes.titleMainPanel}>
              <div>Introducir agentes del expediente</div>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Grid container spacing={24}>
                <Grid item md={6} xs={12} className={classes.marginPanel}>
                  <Arquitecto classes={this.styles} />
                </Grid>
                <Grid item md={6} xs={12} className={classes.marginPanel}>
                  <Promotores customClass={styles} />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>

        <Grid item xs={12} className="py-5">
          <Button variant="contained" size="small" color="primary" className="float-right px-3">
            Finalizar
          </Button>
          <Button color="primary" size="small" className="float-right mx-2">
            Cancelar<Close className={classes.rightIcon} />
          </Button>
          <Button color="primary" size="small" className="float-left px-4">
            Volver
          </Button>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(Agentes);