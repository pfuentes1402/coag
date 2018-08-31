// @flow
import React from 'react';
import { withLocalize } from 'react-localize-redux';
import './Main.css';

const LanguageToggle = ({languages, activeLanguage, setActiveLanguage}) => {
  const getClass = (languageCode) => {
    return languageCode === activeLanguage.code ? 'active' : ''
  };

  return (
    <ul className="selector">
      {languages.map(lang => 
        <li key={ lang.code }>
          <li className={getClass(lang.code)} onClick={() => setActiveLanguage(lang.code)}>{ lang.code }</li>        
        </li>
      )}
    </ul>
  );
};

export default withLocalize(LanguageToggle);