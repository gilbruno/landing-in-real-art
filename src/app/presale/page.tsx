"use client"
import { useEffect, useState } from "react"
import Footer from "../../components/footer/Footer"
import Menu from "../../components/menu/Menu"
import BuyingProcess from "../../components/presale/BuyingProcess/BuyingProcess"
import DropPanel from "../../components/presale/DropPanel/DropPanel"
import HeroSection from "../../components/presale/HeroSection/HeroSection"
import PresalePros from "../../components/presale/PresalePros/PresalePros"
import FooterMobile from "../../components/footer/FooterMobile"
import styles from './PresalePage.module.scss'
import HeroSectionMobile from "../../components/presale/HeroSection/HeroSectionMobile"
import PresaleProsMobile from "../../components/presale/PresalePros/PresaleProsMobile"
import BuyingProcessMobile from "../../components/presale/BuyingProcess/BuyingProcessMobile"
import HeroSectionTablet from "../../components/presale/HeroSection/HeroSectionTablet"
import Investment from "../../components/presale/Investment/Investment"
import Invest from "../../components/presale/Invest/Invest"

export default function PresalePage() {

    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 700)
        setIsTablet(window.innerWidth < 1300)
      }

      const hash = window.location.hash
        if (hash) {
          setTimeout(()=> {
            document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" })
          }, 1000)
        }
  
      checkScreenSize()
      window.addEventListener('resize', checkScreenSize)
  
      return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    
    return (
        <>
        <div className={styles["index"]}>
            <div className={styles["frame"]}>

            {isMobile 
                ?
                    <>
                        <HeroSectionMobile/>
                        <DropPanel/>
                        <PresaleProsMobile/>
                        <Invest/>
                        <BuyingProcessMobile/>
                        <FooterMobile containsEmail={true}/>
                    </>
                :
                    
                    <>
                        {isTablet ?<HeroSectionTablet/>:<HeroSection/>}
                        <DropPanel/>
                        <PresalePros/>
                        <Invest/>
                        {isTablet ?<BuyingProcessMobile/>:<BuyingProcess/>}
                        <Footer/>
                    </>
            }
            </div>
        </div>
        </>
    )
}


        