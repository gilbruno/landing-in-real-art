import styles from './LanguageSelector.module.css'
import { FC, useRef, useState } from "react";
import { useAppContext } from "../../context";
import useClickAway from '../../hooks/useClickAway';

export interface LanguageSelectorProps {
  isClosed: boolean
}

const LanguageSelector: FC<LanguageSelectorProps> = ({isClosed}) => {

  const { setLang, lang} = useAppContext();

  const [showDropdown, setShowDropdown] = useState(false);

  // create a React ref for the dropdown element
  const dropdown = useRef(null);
  
  const closeMenu = () => {
    setShowDropdown(false)
  }

  //Close menu if click anywhere else
  const alertClickAway = () => {
    closeMenu()
  }
    
  useClickAway(dropdown, alertClickAway);


  const setLanguage = (language: string) => {
    setLang(language);
    setShowDropdown(false); // Hide dropdown after selecting language
  };

  return (
    <div className={styles.languageSelector}>
      {(showDropdown && !isClosed) && (
        <div className={styles.dropdown} ref={dropdown}>
          <div className={styles.lang} onClick={() => setLanguage('EN')}>EN &nbsp;<img width={24} height={24} src='img/flag_EN.png' alt="english"></img></div>
          <div className={styles.lang} onClick={() => setLanguage('FR')}>FR &nbsp;<img width={24} height={24} src='img/flag_FR.png' alt="french"></img></div>
          {/* <div className={styles.lang} onClick={() => setLanguage('CN')}>CN &nbsp;<img src='img/flag_CN.png' alt="chinese"></img></div>*/}
        </div>
      )}
      <div onClick={() => setShowDropdown(b => !b)}>
        <img src={`img/flag_${lang}.png`} alt="Language" width={30} height={30} />
      </div>
      
    </div>
  );
};

export default LanguageSelector;