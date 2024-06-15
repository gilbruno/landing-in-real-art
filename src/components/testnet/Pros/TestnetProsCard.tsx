// components/ImageBlock.tsx
'use client'
import Link from 'next/link';
import styles from './TestnetPros.module.scss'; // Import the CSS module
import RegistrationTestnet from '../HeroSection/RegistrationTestnet';
import useSharedLogicHeroSection from '@/components/home/HeroSection/useSharedLogicHeroSection';
import { useAppContext } from '@/context';
import { Lang } from '@/types/types';
import { useState } from 'react';


// Define a type for the component props
interface TestnetProsCardProps {
  number: string
  title1: string
  urlLink: string
  backgroundImage: string
}

const TestnetProsCard: React.FC<TestnetProsCardProps> = ({ number, title1, urlLink, backgroundImage}) => {

  const FIREBASE_TESTNET_HEADER_COLLECTION = 'Testnet_Header'

  const {headerButtons, setHeaderButtons, headerTexts, setHeaderTexts} = useSharedLogicHeroSection(FIREBASE_TESTNET_HEADER_COLLECTION);

  const [modalTestnetRegistration, setModalTestnetRegistration] = useState<boolean>(false)
  
  //Get the language of the global context
  const { lang } = useAppContext();
  const lang_ = lang as Lang;
  
  return (
    
    <div className={styles.imageBlock} style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className={styles.number}>{number}</div>
      <div className={styles.title1}>
        
        { number == '01' && 
            <div onClick={() => setModalTestnetRegistration(true)}>{title1}</div>
          }

        { number != '01' && 
            <Link href={urlLink}>
            {title1}
            </Link>
          }
  
        
      </div>
      <RegistrationTestnet
        title={headerTexts.registrationFormTitle[lang_]}
        description={headerTexts.registrationFormDescription[lang_]}
        showModal={modalTestnetRegistration}
        setShowModal={setModalTestnetRegistration}
      />
    </div>
  );
};

export default TestnetProsCard;
