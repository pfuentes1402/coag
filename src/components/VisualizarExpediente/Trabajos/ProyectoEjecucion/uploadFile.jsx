import React, { Component } from 'react';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { withStyles, Paper } from '@material-ui/core';
import Vault from '../../../VaultUpload/Vault';

const styles = theme => ({
  withoutRadius: {
    borderRadius: 0
  }
});

class UploadFile extends Component {
  render() {
    let {classes} = this.props;
    return (
      <Paper className={`${classes.withoutRadius} pb-3`}>
        <Vault toolbar autosend ></Vault>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(UploadFile)));