import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TablaCatastro from './TablaCatastro';
import { Button } from 'reactstrap';


   
   // Create component for datalist input
   class Datalist extends Component {
    render() {
     // Get all options from option prop
     const dataOptions = this.props.options.split(', ');
   
     // Generate list of options
     const dataOptionsList = dataOptions.map((dataOption, index) => {
      return <option key={index} value={dataOption} />
     });
   
     return (
      <div>
       <Label
        hasLabel={this.props.hasLabel}
        htmlFor={this.props.htmlFor}
        label={this.props.label}
       />
    
       <input list={this.props.htmlFor} />
    
       <datalist
        defaultValue=''
        id={this.props.htmlFor}
        name={this.props.name || null}
        required={this.props.required || null}
       >
        <option value='' disabled>Select one option</option>
   
        {dataOptionsList}
       </datalist>
      </div>
     );
    }
   }
   
   // Create component for checkbox input
   class Checkbox extends Component {
    render() {
     return (
      <fieldset>
       <label
        htmlFor={this.props.htmlFor}
        label={this.props.label}
       >
        <input
         id={this.props.htmlFor}
         name={this.props.name || null}
         required={this.props.required || null}
         type='checkbox'
        />
        {this.props.label}
       </label>
      </fieldset>
     );
    }
   }
   
   // Create component for label
   class Label extends Component {
    render() {
     if (this.props.hasLabel === 'true') {
      return <label htmlFor={this.props.htmlFor}>{this.props.label}</label>
     }
    }
   }
   
   // Create component for input
   class Input extends Component {
    render() {
     return (
         <div>
       <Label
        hasLabel={this.props.hasLabel}
        htmlFor={this.props.htmlFor}
        label={this.props.label}
       />
       <br/>
        <input
         id={this.props.htmlFor}
         max={this.props.max || null}
         min={this.props.min || null}
         name={this.props.name || null}
         placeholder={this.props.placeholder || null}
         required={this.props.required || null}
         step={this.props.step || null}
         type={this.props.type || 'text'}
        /></div>
     );
    }
   }
   
   // Create component for radio input
   class Radio extends Component {
    render() {
     return (
      <fieldset>
       <label
        htmlFor={this.props.htmlFor}
        label={this.props.label}
       >
        <input
         id={this.props.htmlFor}
         name={this.props.name || null}
         required={this.props.required || null}
         type='radio'
        />
        {this.props.label}
       </label>
      </fieldset>
     );
    }
   }
   
   // Create component for select input
   class Select extends Component {
    render() {
     // Get all options from option prop
     const selectOptions = this.props.options.split(', ');
   
     // Generate list of options
     const selectOptionsList = selectOptions.map((selectOption, index) => {
      return <option key={index} value={index}>{selectOption}</option>
     });
   
     return (
      <fieldset>
       <Label
        hasLabel={this.props.hasLabel}
        htmlFor={this.props.htmlFor}
        label={this.props.label}
       />
    
       <select
        defaultValue=''
        id={this.props.htmlFor}
        name={this.props.name || null}
        required={this.props.required || null}
       >
        <option value='' disabled>Select one option</option>
   
        {selectOptionsList}
       </select>
      </fieldset>
     );
    }
   }
   
   // Create component for textarea
   class Textarea extends Component {
    render() {
     return (
      <div>
       <Label
        hasLabel={this.props.hasLabel}
        htmlFor={this.props.htmlFor}
        label={this.props.label}
       />
        <br/>
       <textarea
        cols={this.props.cols || null}
        id={this.props.htmlFor}
        name={this.props.name || null}
        required={this.props.required || null}
        rows={this.props.rows || null}
       >
       </textarea>
      </div>
     );
    }
   }

   // Create component for form
   class Form extends Component {
      constructor(props) {
        super(props);
        this.validar = this.validar.bind(this);
        this.updateInputValue = this.updateInputValue.bind(this);
        this.state = {
          inputUbicacion: '',
        };
      }
      validar(e){
        console.log(e);
        var a = "cadena";
        if(e != ''){
          var api = `http://servicios.coag.es/api/DatosCatastro/${e}`;
          console.log(api);
          fetch(api)
            .then((response) => {
                return response.json();
            })
            .then((temp) => {
              console.log(temp);
          });
        }
      }
      updateInputValue(e){
        this.setState({
          inputUbicacion: e.target.value
        });
      }
     render() {
      return (
       <form method='' action=''>
       <div>
        <Input
          hasLabel='true'
          htmlFor='textInput'
          label='Código Expediente'
          required='true'
          type='text'
        />
      
        <Input
          hasLabel='true'
          htmlFor='estudioInput'
          label='Código Estudio'
          required='true'
          type='text'
        />
      
        <Input
          hasLabel='true'
          htmlFor='numberInput'
          label='Título Expediente'
          required='true'
          type='text'
        />
      
        <Input
          hasLabel='true'
          htmlFor='passwordInput'
          label='Antecedente'
          required='true'
          type='text'
        />
          <p>Introducir el código del expediente en caso que(..)</p>
          <Button color="secondary">secondary</Button>
          <Textarea
          hasLabel='true'
          htmlFor='textarea'
          label='Observaciones del estudio'
          required='true'
        />
        </div>
        <div>
        <input
          htmlFor='inputUbicacion2'
          label='inputUbicación2'
          required='true'
          type='text'
          value={this.state.inputUbicacion}
          onChange={e => this.updateInputValue(e)}
        />
        <p>La dirección se proporcionará automáticamente</p>
        <button onClick={e => this.validar(this.state.inputUbicacion)}>Validar</button>
      
        <TablaCatastro data={this.state.Ubicacion}/>

          <Input
          hasLabel='true'
          htmlFor='passwordInput'
          label='Alias dirección'
          required='true'
          type='text'
          />
          <p>Introducir un alias para la dirección en caso que (...)</p>
          <div>
          <Button
          type='submit'
          value='cancelar'
          text='Cancelar'
          />
          <Button
          type='submit'
          value='submit'
          text='Guardar y crear expediente'
          />
          </div>
          </div>
        </form>
      )
      }
      
    }
    
    // Render Form component
    export default Form;