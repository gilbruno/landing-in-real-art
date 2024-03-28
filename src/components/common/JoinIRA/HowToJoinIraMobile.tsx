"use client"
import Link from 'next/link'
import { useAppContext } from '../../../context'
import { JoinIraDataButton, JoinIraDataText, Lang } from '../../../types/types'
import styles from './HowToJoinIraMobile.module.scss'
import useSharedLogicHowToJoinIra from './useSharedLogicHowToJoinIra'

export interface HowToJoinIraProps {
  joinIraDataText: JoinIraDataText
  joinIraDataButton: JoinIraDataButton
  onlyFirstButton: boolean
}

const HowToJoinIraMobile = ({joinIraDataText, joinIraDataButton, onlyFirstButton, ...props}: HowToJoinIraProps) => {

  //Get the language of the global context
  const {lang} = useAppContext()
  const lang_ = lang as Lang

  
  return (
    <div className={styles["feature"]}>
    <img
      className={styles["rectangle-210"]}
      src="img/rectangle-2100.png" alt=''
    />
    <div className={styles["frame-303"]}>
      <div className={styles["comment"]}>{joinIraDataText.headerText[lang_]}</div>
      <div className={styles["lp-mobile-join-ira-main-description"]}>
        {joinIraDataText.text1[lang_]}
      </div>
      <div className={styles["link-button"]}>
        <div className={styles["button2"]}>
          <Link className={styles.joinIRALink} href={joinIraDataButton.JoinIRALink}>
            <div className={styles["rejoindre-ira2"]}>
              {joinIraDataButton.JoinIRA[lang_]}
            </div>
         </Link>   
        </div>
        {joinIraDataButton.StartIRA && 
          <div className={styles["button3"]}>
            <Link className={styles.startIRALink} href={joinIraDataButton.StartIRALink[lang_]}>
              <div className={styles["je-d-marre2"]}>
                {joinIraDataButton.StartIRA[lang_]}
              </div>
            </Link>     
          </div>
        }
      </div>
    </div>
  </div>
  )
}

export default HowToJoinIraMobile