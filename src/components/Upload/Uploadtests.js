import React, { PureComponent } from 'react'
import { connect } from 'react-redux';
import { dispachFilesToUpload } from './../../actions/trabajos'


class Uploadtests extends PureComponent {
constructor(props){
    super(props);

this.ListenForChanges=this.ListenForChanges.bind(this)
this.ListenerSubmit=this.ListenerSubmit.bind(this)
} 

 ListenForChanges(e){
  
     let inT=e.target.files;
     var fileList = [];
     for (let i = 0; i < inT.length; i++) {
        fileList.push(inT[i])         
     }
     this.props.dispachFilesToUpload(fileList)
 }
 ListenerSubmit(e){
e.preventDefault()

 } 
 
    render() {

    return (
        <div>
        <form id='file-capcher'>
            <input id='file-input' onChange={this.ListenForChanges} type="file" multiple/>
            <button type='submit' onSubmit={this.ListenerSubmit}>Enviar
            </button>
        </form>
          
        </div>
    )
  }
}


const mapStateToProps = state => ({
  
    });
    
    
export default connect(mapStateToProps,{ dispachFilesToUpload })(Uploadtests);
    