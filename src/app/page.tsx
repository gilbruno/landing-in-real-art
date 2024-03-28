"use client"
import { useEffect } from "react";
import Menu from "../components/menu/Menu";
import Footer from "../components/footer/Footer";
import HeroSection from "../components/home/HeroSection/HeroSection";
import JoinMovement from "../components/home/JoinMovement/JoinMovement";
import Newsletter from "../components/home/Newsletter/Newsletter";
import Team from "../components/home/Team/Team";
import HeroSectionMobile from "../components/common/HeroSection/HeroSectionMobile";
import HowToJoinIraMobile from "../components/common/JoinIRA/HowToJoinIraMobile";
import JoinMovementMobile from "../components/home/JoinMovement/JoinMovementMobile";
import NewsletterMobile from "../components/home/Newsletter/NewsletterMobile";
import FooterMobile from "../components/footer/FooterMobile";
import CarouselArtists from "../components/home/Artists/CarouselArtists";
import styles from './HomePage.module.scss'
import Partners from "../components/home/Partners/Partners";
import useSharedLogic from "./useSharedLogic";
import HowToJoinIra from "../components/common/JoinIRA/HowToJoinIra";
import useSharedLogicFaq from "../components/common/Faq/useSharedLogicFaq";
import FaqMobile from "../components/common/Faq/FaqMobile";
import Faq from "../components/common/Faq/Faq";
import useSharedLogicHeroSection from "../components/home/HeroSection/useSharedLogicHeroSection";
import useSharedLogicHowToJoinIra from "../components/common/JoinIRA/useSharedLogicHowToJoinIra";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function HomePage() {

  const {isMobile, setIsMobile} = useSharedLogic(800)
  const FIREBASE_FAQ_COLLECTION = 'Faq'
  const FIREBASE_HEADER_COLLECTION = 'Header'
  const FIREBASE_JOIN_IRA_COLLECTION = 'JoinIRA'
  const {faqButtons, faqTexts } = useSharedLogicFaq(FIREBASE_FAQ_COLLECTION)
  const {headerButtons, setHeaderButtons, headerTexts, setHeaderTexts} = useSharedLogicHeroSection(FIREBASE_HEADER_COLLECTION);
  const {joinIraDataText, joinIraDataButton} = useSharedLogicHowToJoinIra(FIREBASE_JOIN_IRA_COLLECTION)

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(()=> {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" })
      }, 200)
    }
  })

    return (

      <div id="home" className={styles["home"]} style={isMobile?{paddingTop:'0px'}:{paddingTop:''}}>

      {isMobile ? 
        <>
          <HeroSectionMobile headerTexts={headerTexts} headerButtons={headerButtons} onlyFirstButton={false}/>
          
          <HowToJoinIraMobile joinIraDataText={joinIraDataText} joinIraDataButton={joinIraDataButton} onlyFirstButton={false}/>
          <JoinMovementMobile/>
          <CarouselArtists/>
          <Team/>
          <FaqMobile faqTexts={faqTexts} faqButtons={faqButtons}/>
          <Partners/>
          <NewsletterMobile/>
          {/*<PrivateSaleMobile/>*/}
          <FooterMobile containsEmail={false}/>
        </>  
          : 
        <>
          <HeroSection />
          
          <HowToJoinIra joinIraDataText={joinIraDataText} joinIraDataButton={joinIraDataButton} onlyFirstButton={false}/>
          <JoinMovement/>
          <CarouselArtists/>
          <Team/>
          <Faq faqTexts={faqTexts} faqButtons={faqButtons} />
          <Partners/>
          <Newsletter/>
          {/*<PrivateSale/>*/}
          <Footer/>
        </>  
      }

    </div>

    )


}    