import { useAppContext } from '../../../context';
import { Lang, PresaleInvestmentsTexts } from '../../../types/types';
import styles from './ToolTipOffer.module.scss'
import { FC, useState } from "react";
import TooltipOfferDetail from './TooltipOfferDetail';

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

  const cards = [
    investmentTexts.card1,
    investmentTexts.card2,
    investmentTexts.card3
  ]

  let card = cards[offerNumber-1]

  const setToolTipOffer = () => {
    setShowTooltip(false); // Hide tooltip offers
  };

  return (
    <div className={styles.languageSelector}>
      {(showTooltip && !isClosed) && (
        <div className={styles.dropdownContainer}>
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