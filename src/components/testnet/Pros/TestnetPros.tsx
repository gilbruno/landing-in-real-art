
import React from 'react';

import styles from './TestnetPros.module.scss'; 
import { useAppContext } from '../../../context';
import { Lang } from '../../../types/types';
import useSharedLogicTestnetPros from './useSharedLogicTestnetPros';
import TestnetProsCard from './TestnetProsCard';


// Define a type for the image block data
interface ImageBlockData {
  number: string;
  title1: string;
  title2: string;
  backgroundImage: string;
  desc: string;
  listItems?: string[];
}

const TestnetPros = () =>  {
    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang
    const {texts, setTexts} = useSharedLogicTestnetPros()
  
    const cards = [
      texts.card1,
      texts.card2,
      texts.card3,
      texts.card4,
    ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
          <div className={styles.mainTitle}>{texts.header.title[lang_]}</div>
          <div className={styles.mainDescription}>
          {texts.header.description[lang_]}
          </div>
      </div>

      <div className={styles.imageBlockContainer}>
        {cards.map((data, index) => (
          <TestnetProsCard key={index} 
            number={data.number[lang_]} 
            title1={data.title1[lang_]} 
            urlLink={data.urlLink} 
            backgroundImage={data.backgroundImage} 
            />
        ))}
      </div>
   </div>   
  );
}

export default TestnetPros
