"use client"
import { useAppContext } from "../../../context"
import { Lang } from "../../../types/types"
import Link from "next/link"
import styles from './HeroSection.module.scss'
import useSharedLogicHeroSection from "./useSharedLogicHeroSection"

const HeroSectionTablet = () => {
    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang

    const FIREBASE_PRESALE_HERO_SECTION_SEE_DROP = 'seeDrop'
    const FIREBASE_PRESALE_HERO_SECTION_SEE_DROP_LINK = 'seeDropLink'

    
    const {
        presaleButtons, setPresaleButtons, 
        presaleTexts, setPresaleTexts
    } = useSharedLogicHeroSection()

    return (
        <div className={styles["heroSectionContainer"]}>
            <div className={styles["heroSectionContainer1"]}>   
                <div className={styles["heroSectionTopTitle"]}>
                    <p>
                        <span className={styles["heroSectionTopTitle1"]}> {presaleTexts.title1[lang_]} </span>
                        <span className={styles["heroSectionTopTitle2"]}>{presaleTexts.title2[lang_]}</span>
                    </p>
                </div>
                <div className={styles["heroSectionTopImage"]}>
                    <img alt=""  src="/img/ira_eyes.png"/>
                </div>
                    
                
            </div>
            <div className={styles["heroSectionContainer2"]}>
                <div style={{backgroundImage: 'url(/img/faq_section_hero.jpeg)', borderRadius: '20px', width: '100%', height: '400px'}}>
                    
                </div>
                <div className={styles["heroSectionContainer3"]}>
                    <div className={styles["div-wrapper"]}>
                        <p className={styles["p"]}>
                        {presaleTexts.description[lang_]}
                        </p>
                    </div>
                    <div className={styles["button"]}>
                        <Link href={presaleButtons[FIREBASE_PRESALE_HERO_SECTION_SEE_DROP_LINK]}>
                            <div className={styles["text-wrapper-2"]}>{presaleButtons[FIREBASE_PRESALE_HERO_SECTION_SEE_DROP][lang_]}</div>
                        </Link>
                    </div>

                </div>
            </div>
        </div>

  )
}

export default HeroSectionTablet

