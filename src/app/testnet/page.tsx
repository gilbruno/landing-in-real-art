"use client"
import { useEffect, useState } from "react";
import styles from './TestnetPage.module.scss'

import CookieConsent from "../../components/cookie/CookieConsent"
import HeroSection from "../../components/testnet/HeroSection/HeroSection"
import Menu from "../../components/menu/Menu"
import NewsletterMobile from "../../components/home/Newsletter/NewsletterMobile"
import FooterMobile from "../../components/footer/FooterMobile"
import Newsletter from "../../components/home/Newsletter/Newsletter"
import Footer from "../../components/footer/Footer"
import useSharedLogic from "../useSharedLogic"
import TestnetPros from "../../components/testnet/Pros/TestnetPros"
import useSharedLogicFaq from "../../components/common/Faq/useSharedLogicFaq"
import Faq from "../../components/common/Faq/Faq"
import FaqMobile from "../../components/common/Faq/FaqMobile"
import useSharedLogicHeroSection from "../../components/home/HeroSection/useSharedLogicHeroSection"
import HeroSectionMobile from "../../components/common/HeroSection/HeroSectionMobile"
import useSharedLogicHowToJoinIra from "../../components/common/JoinIRA/useSharedLogicHowToJoinIra";
import HowToJoinIraMobile from "../../components/common/JoinIRA/HowToJoinIraMobile";
import HowToJoinIra from "../../components/common/JoinIRA/HowToJoinIra";

export default function HomePage() {

  const {isMobile, setIsMobile} = useSharedLogic(1000)
  const FIREBASE_TESTNET_FAQ_COLLECTION    = 'Testnet_Faq'
  const FIREBASE_TESTNET_HEADER_COLLECTION = 'Testnet_Header'
  const FIREBASE_JOIN_IRA_COLLECTION       = 'Testnet_JoinIRA'
  const {faqButtons, faqTexts } = useSharedLogicFaq(FIREBASE_TESTNET_FAQ_COLLECTION)
  const {headerButtons, setHeaderButtons, headerTexts, setHeaderTexts} = useSharedLogicHeroSection(FIREBASE_TESTNET_HEADER_COLLECTION);
  const {joinIraDataText, joinIraDataButton} = useSharedLogicHowToJoinIra(FIREBASE_JOIN_IRA_COLLECTION)
  
    return (

      <div id="home" className={styles["home"]} style={isMobile?{paddingTop:'0px'}:{paddingTop:''}}>

      {isMobile ? 
        <>
          <HeroSectionMobile headerTexts={headerTexts} headerButtons={headerButtons} onlyFirstButton={true}/>
          <HowToJoinIraMobile joinIraDataText={joinIraDataText} joinIraDataButton={joinIraDataButton} onlyFirstButton={true}/>
          <TestnetPros/>
          <FaqMobile faqTexts={faqTexts} faqButtons={faqButtons}/>
          <NewsletterMobile/>
          <FooterMobile containsEmail={false}/>
        </>  
          : 
        <>
          <HeroSection headerTexts={headerTexts} headerButtons={headerButtons} onlyFirstButton={true}/>
          <HowToJoinIra joinIraDataText={joinIraDataText} joinIraDataButton={joinIraDataButton} onlyFirstButton={true}/>
          <TestnetPros/>
          <Faq faqTexts={faqTexts} faqButtons={faqButtons} />
          <Newsletter/>
          <Footer/>
        </>  
      }

    </div>

    )


}    