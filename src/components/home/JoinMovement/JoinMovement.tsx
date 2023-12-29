"use client"
import styles from './JoinMovement.module.scss'
import { useAppContext } from '../../../context'
import { useEffect, useState } from "react";
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';
import parse from 'html-react-parser';
import { JoinTrendButtons, JoinTrendData, JoinTrendTexts, Lang, defaultLangObject } from '../../../types/types';
import Link from 'next/link';
import JoinMovementLink1 from './JoinMovementLink1';
import VuesaxLinearStatusUp from './VuesaxLinearStatusUp';
import JoinMovementLink2 from './JoinMovementLink2';

const JoinMovement = () => {
    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang
    const FIREBASE_JOIN_MOVEMENT_COLLECTION = 'JoinMovement'

    const defaultJoinTrendButtons =  {   
      artgallery_join: defaultLangObject,
      artgallery_join_link: '',
      aas_join: defaultLangObject,
      aas_join_link: '',
      marketplace_join: defaultLangObject,
      marketplace_join_link: ''    
    }

    const defaultJoinTrendTexts =  {   
      title: defaultLangObject,
      artgallery_title: defaultLangObject,
      artgallery_description: defaultLangObject,
      aas_title: defaultLangObject,
      aas_description: defaultLangObject,
      marketplace_title: defaultLangObject,
      marketplace_description: defaultLangObject
      } 

    
    const [joinTrendButtons, setJoinTrendButtons] = useState<JoinTrendButtons>(defaultJoinTrendButtons)
    const [joinTrendtexts, setJoinTrendTexts]     = useState<JoinTrendTexts>(defaultJoinTrendTexts)

    useEffect(() => {
      const fetchData = async () => {
        const joinMovementCollection = collection(db, FIREBASE_JOIN_MOVEMENT_COLLECTION);
        const joinMovementDocuments  = await getDocs(joinMovementCollection);
        const joinMovementData      = joinMovementDocuments.docs.map(doc => doc.data());
        
        //Buttons : indice 0
        setJoinTrendButtons(joinMovementData[0] as JoinTrendButtons) 

        //Texts : indice 1
        setJoinTrendTexts(joinMovementData[1] as JoinTrendTexts)
      }

      fetchData();

    }, [])

    return (
        <div className={styles.frame48095739}>
          <div className={styles.titleJoinMovement}>
            <div className={styles.rejoindreLeMouvement}>{parse(joinTrendtexts.title[lang_])}</div>
          </div>
          <div className={styles.wrraperCard}>
            <div className={styles.frameArtgallery}>
              <div className={styles.frame76}>
                <div className={styles.rectangle52}></div>

                <VuesaxLinearStatusUp/>

              </div>
              <div className={styles.frame7}>
                <div className={styles.heading2}>
                  {parse(joinTrendtexts.artgallery_title[lang_])}
                </div>
                <div className={styles.paragraph2}>
                  {parse(joinTrendtexts.artgallery_description[lang_])}
                </div>
              </div>
              <div className={styles.buttonJoinMovement}>
                <Link className={styles.joinMovementLink} href={joinTrendButtons.artgallery_join_link}>
                  <div className={styles.heading3}>{joinTrendButtons.artgallery_join[lang_]}</div>
                </Link>  
              </div>
            </div>
            <div className={styles.frameArtasservice}>
              <div className={styles.frame48095731}>
                <div className={styles.frame76}>
                  <div className={styles.rectangle52}></div>
                  <VuesaxLinearStatusUp/>
                </div>
                <div className={styles.frame7}>
                  <div className={styles.heading4}>
                    {parse(joinTrendtexts.aas_title[lang_])}
                  </div>
                  <div className={styles.paragraph2}>
                    {parse(joinTrendtexts.aas_description[lang_])}
                  </div>
                </div>
                <div className={styles.buttonJoinMovement}>
                  <Link className={styles.joinMovementLink} href={joinTrendButtons.aas_join_link}>
                    <div className={styles.heading3}>{joinTrendButtons.aas_join[lang_]}</div>
                  </Link>  
                </div>
              </div>
            </div>
            <div className={styles.frameMarketplace}>
              <div className={styles.frame76}>
                <div className={styles.rectangle52}></div>
                <VuesaxLinearStatusUp/>

              </div>
              <div className={styles.frame72}>
                <div className={styles.heading5}>{joinTrendtexts.marketplace_title[lang_]}</div>
                <div className={styles.paragraph2}>
                  {parse(joinTrendtexts.marketplace_description[lang_])}  
                </div>
              </div>
              <div className={styles.buttonJoinMovement}>
                <Link className={styles.joinMovementLink} href={joinTrendButtons.marketplace_join_link}>
                  <div className={styles.heading3}>{joinTrendButtons.marketplace_join[lang_]}</div>
                </Link>  
              </div>
            </div>

            <JoinMovementLink1/>
            <JoinMovementLink2/>
            

          </div>
        </div>
    )
}

export default JoinMovement