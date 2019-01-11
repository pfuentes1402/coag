import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import UploadFile from './uploadFile';

class TrabajoEjecucion extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ minHeight: 800 }} className="m-2">
        <Grid container spacing={16}>
          <Grid item md={6} xs={12} className="p-3">
          </Grid>
          <Grid item md={6} xs={12} className="p-3">
            <UploadFile/>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default TrabajoEjecucion;