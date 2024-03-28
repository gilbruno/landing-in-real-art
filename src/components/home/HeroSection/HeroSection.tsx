"use client"
import styles from './HeroSection.module.scss'
import { useAppContext } from "../../../context";
import { Lang } from "../../../types/types";
import ImageHeroSection from "./ImageHeroSection";
import Link from "next/link";
import useSharedLogicHeroSection from './useSharedLogicHeroSection';


const HeroSection = () => { 

    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang
    const FIREBASE_HEADER_COLLECTION = 'Header'
    const {headerButtons, setHeaderButtons, headerTexts, setHeaderTexts} = useSharedLogicHeroSection(FIREBASE_HEADER_COLLECTION);

    return (
      <div className={styles.heroSection}>
        <div className={styles.heroSectionWrapperTopContain}>
          <div className={styles.heroSectionTopContain}>
            <div className={styles.heroSectionTitle}>
              <div className={styles.heroSectionHeading}>
                <span>
                  <span className={styles.heroSectionHeadingSpan}>
                    {headerTexts.title1[lang_]}
                    <br />
                  </span>
                  <span className={styles.heroSectionHeadingSpan2}>{headerTexts.title2[lang_]}</span>
                </span>
              </div>
            </div>
            <div className={styles.heroSectionContainerButton}>
              
              <div className={styles.heroSectionButton}>
                <Link href={headerButtons.button1Link}>
                  <div className={styles.heroSectionRejoindreIra}>{headerButtons.button1[lang_]}</div>
                </Link>
              </div>
              
              <div className={styles.heroSectionButton}>
                <Link href={headerButtons.button2Link}>
                  <div className={styles.heroSectionJeDemarre}>{headerButtons.button2[lang_]}</div>
                </Link>  
              </div>
            </div>
          </div>
          <ImageHeroSection/>
        </div>
        <div className={styles.heroSectionParapgraphe}>
          <div className={styles.heroSectionParagraph}>
            {headerTexts.text1[lang_]}
          </div>

            {/*<SpheresHeroSection/>*/}
        </div>
      </div>

     
    )

}

export default HeroSection