import React from 'react'
import { Lang, TooltipOfferDetailProps } from '../../../types/types'
import { useAppContext } from '../../../context'
import styles from "./ToolTipOffer.module.scss"; // Import the CSS module

const CheckBoxChecked = () => {
    return (
      <svg
        className={styles["frame-3387__group-36601"]}
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="11" fill="#E4EBF5" />
        <path
          d="M7 11L10 14L16 8"
          stroke="#1751F0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  
const TooltipOfferDetail = (props: TooltipOfferDetailProps) => {
  const {
    presaleInvestmentCard
  } = props

    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang
  
  return (
    <>
        <div className={styles.details1}>
          {presaleInvestmentCard.details1[lang_]?.map(
            (item, index) =>
              item && (
                <div key={index} className={styles.details1Item}>
                  <CheckBoxChecked key={index} />
                  <p>{item}</p>
                </div>
              )
          )}
        </div>
        <div className={styles.details2}>
          {presaleInvestmentCard.details2[lang_]?.map(
            (item, index) =>
              item && (
                <div key={index} className={styles.details2Item}>
                  <CheckBoxChecked key={index} />
                  <p>{item}</p>
                </div>
              )
          )}
        </div>
    </>
  )
}

export default TooltipOfferDetail