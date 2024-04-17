import { useAppContext } from '../../../context';
import { Lang, PresaleInvestmentsTexts } from '../../../types/types';
import styles from './ToolTipOffer.module.scss'
import { FC, useRef, useState } from "react";
import TooltipOfferDetail from './TooltipOfferDetail';
import useClickAway from '../../../hooks/useClickAway';

export interface ToolTipOfferProps {
  offerNumber: number,
  isClosed: boolean,
  investmentTexts: PresaleInvestmentsTexts
}

const ToolTipOffer: FC<ToolTipOfferProps> = ({offerNumber, isClosed, investmentTexts}) => {

  //Get the language of the global context
  const {lang} = useAppContext()
  const lang_ = lang as Lang
  
  const [showTooltip, setShowTooltip] = useState(false);

  // create a React ref for the dropdown element
  const dropdown = useRef(null);

  const cards = [
    investmentTexts.card1,
    investmentTexts.card2,
    investmentTexts.card3
  ]

  let card = cards[offerNumber-1]

  const closeMenu = () => {
    setShowTooltip(false)
  }

  //Close menu if click anywhere else
  const alertClickAway = () => {
    closeMenu()
  }
    
  useClickAway(dropdown, alertClickAway);

  const setToolTipOffer = () => {
    setShowTooltip(false); // Hide tooltip offers
  };

  return (
    <div className={styles.languageSelector}>
      {(showTooltip && !isClosed) && (
        <div className={styles.dropdownContainer} ref={dropdown}>
          <div className={styles.dropdown} onClick={() => setToolTipOffer()}>
            <TooltipOfferDetail presaleInvestmentCard={card}/>
          </div>
        </div>
      )}
      <img src="/img/questionMark.svg" onClick={() => setShowTooltip(!showTooltip)}/>
    </div>
  );
};

export default ToolTipOffer;