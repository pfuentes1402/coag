/* eslint-disable */
import React, {Component} from 'react';
const Uppy = require('@uppy/core')
const Tus = require('@uppy/tus')
const GoogleDrive = require('@uppy/google-drive')
const { Dashboard, DashboardModal, DragDrop, ProgressBar } = require('@uppy/react')





class Upload extends Component {

 
  constructor (props) {
    super(props)

    this.state = {
      showInlineDashboard: false,
      open: false
    }

    this.handleModalClick = this.handleModalClick.bind(this)
  }

  componentWillMount () {
    this.uppy = new Uppy({ id: 'uppy1', autoProceed: true, debug: true  })
      .use(Tus, { endpoint: 'https://master.tus.io/files/', onBeforeUpload: (files) => {
        return files.map((file) => {
          return (file.tus.headers = { 'Token': '/1PlvyfUpJ4qZusW0lehLx0SJ4Xk8Oor03yJOg8V1DEI7fFb2NHUvfi4Zg7xGGRRpFRo1TKeQkl29YlIxB9laA==' });
        });
      } })
      .use(GoogleDrive, { serverUrl: 'https://companion.uppy.io' })

    this.uppy2 = new Uppy({ id: 'uppy2', autoProceed: false, debug: true })
      .use(Tus, { endpoint: 'https://master.tus.io/files/' })
  }


  // .use(XHRUpload, {
  //   endpoint: 'https://master.tus.io/files/'
  //   // endpoint: 'https://servicios.coag.es/api/expedientes/703378/AlmacenTemporalArchivos',
  //   // 'Token': '/1PlvyfUpJ4qZusW0lehLx0SJ4Xk8Oor03yJOg8V1DEI7fFb2NHUvfi4Zg7xGGRRpFRo1TKeQkl29YlIxB9laA=='
  // })






  componentWillUnmount () {
    this.uppy.close()
    this.uppy2.close()
  }

  handleModalClick () {
    this.setState({
      open: !this.state.open
    })
  }

  render () {
    const { showInlineDashboard } = this.state
    return (
      <div>       
       
        <label>
          <input
            type="checkbox"
            checked={showInlineDashboard}
            onChange={(event) => {
              this.setState({
                showInlineDashboard: event.target.checked
              })
            }}
          />
          
        </label>
        {showInlineDashboard && (
          <Dashboard
            uppy={this.uppy}
            plugins={['GoogleDrive']}
            metaFields={[
              { id: 'name', name: 'Name', placeholder: 'File name' }
            ]}
          />
        )}

   
        

       

      
        <ProgressBar
          uppy={this.uppy}
          hideAfterFinish={false}
        />
      </div>
    )
  }

}








export default Upload;