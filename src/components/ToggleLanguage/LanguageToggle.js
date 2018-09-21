// @flow
import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { connect } from 'react-redux';

import './Main.css';

const LanguageToggle = ({languages, activeLanguage, setActiveLanguage}) => {
  const getClass = (languageCode) => {
    return languageCode === activeLanguage.code ? 'active' : ''
  };

  return (
    <ul className="selector">
      {languages.map(lang => 
        <li key={ lang.code }>
              
          <li className={getClass(lang.code)} onClick={(e) =>{setActiveLanguage(lang.code);} }>{ lang.code }</li>        
        </li>
      )}
    </ul>
  );
};


const mapStateToProps = state => ({
 
});





export default withLocalize(connect(mapStateToProps,{   })(LanguageToggle));