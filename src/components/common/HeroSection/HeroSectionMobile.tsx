import styles from './HeroSectionMobile.module.scss'
import HeroSectionImageMobile from './HeroSectionImageMobile'
import { useAppContext } from '../../../context'
import { HeaderButtons, HeaderTexts, Lang } from '../../../types/types'
import useSharedLogicHeroSection from '../../home/HeroSection/useSharedLogicHeroSection'
import Link from 'next/link'
import parse from 'html-react-parser';
import RegistrationTestnet from '@/components/testnet/HeroSection/RegistrationTestnet'
import { useState } from 'react'

export interface HeroSectionMobileProps {
  headerTexts: HeaderTexts
  headerButtons: HeaderButtons
  onlyFirstButton: boolean
  pageOrigin?: string
}


const HeroSectionMobile = ({headerTexts, headerButtons, onlyFirstButton, pageOrigin, ...props}: HeroSectionMobileProps) => {
  
  console.log('headerTExt', headerTexts)
  //Get the language of the global context
  const {lang} = useAppContext()
  const lang_ = lang as Lang

  const [modalTestnetRegistration, setModalTestnetRegistration] = useState<boolean>(false)

  return (
    <div className={styles["frame-48095810"]}>
    <div className={styles["frame-48095809"]}>
      <div className={styles["heading"]}>
        <span>
          <span className={styles["heading-span"]}>
            {parse(headerTexts.title1[lang_])}
          </span><br/>
          <span className={styles["lp-mobile-heading-span2"]}>{parse(headerTexts.title2[lang_])}</span>
        </span>
      </div>
    </div>
    <div className={styles["container-button"]}>
      <div className={styles["frame-button"]}>
      {pageOrigin == 'testnet' && 
        <div className={styles["button"]} onClick={() => setModalTestnetRegistration(true)}>
          <div className={styles["rejoindre-ira"]}>
              {parse(headerButtons.button1[lang_])}
          </div>
        </div>
      }  
      {pageOrigin != 'testnet' && 
        <div className={styles["button"]}>
          <Link href={headerButtons.button1Link}>
            <div className={styles["rejoindre-ira"]}>
              {parse(headerButtons.button1[lang_])}
            </div>
          </Link>  
        </div>
      }
        
      </div>
      {
        onlyFirstButton === false &&   
          (
            <div className={styles["frame-button2"]}>
              <div className={styles["button"]}>
                <Link href={headerButtons.button2Link}>
                  <div className={styles["je-d-marre"]}>
                    {parse(headerButtons.button2[lang_])}
                  </div>  
                </Link>  
              </div>
            </div>
          )
      }
      
    </div>
    
    {pageOrigin == 'testnet' && 
        <RegistrationTestnet
        title={headerTexts.registrationFormTitle[lang_]}
        description={headerTexts.registrationFormDescription[lang_]}
        showModal={modalTestnetRegistration}
        setShowModal={setModalTestnetRegistration}
      />
    }
    
      
    <HeroSectionImageMobile/>
  </div>

  )
}

export default HeroSectionMobile