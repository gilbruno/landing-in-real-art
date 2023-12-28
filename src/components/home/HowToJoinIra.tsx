"use client"
import styles from './HowToJoinIra.module.css'
import { useEffect, useState } from "react"
import { useAppContext } from "../../context"
import { JoinIraDataButton, JoinIraDataText, Lang, defaultLangObject } from "../../types/types"
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';
import Link from 'next/link';


const HowToJoinIra = () => {

    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang
  
    const FIREBASE_JOIN_IRA_COLLECTION = 'JoinIRA'
    
    const defaultJoinIraText = {
      text1: defaultLangObject,
      text2: defaultLangObject,
      headerText: defaultLangObject
    }
  
    const defaultJoinIraButton = {
      JoinIRA: defaultLangObject,
      StartIRA: defaultLangObject,
      JoinIRALink: '',
      StartIRALink: ''
    }
  
  
    const [joinIraDataText, setJoinIraDataText] = useState<JoinIraDataText>(defaultJoinIraText);
    const [joinIraDataButton, setJoinIraDataButton] = useState<JoinIraDataButton>(defaultJoinIraButton);
  
    useEffect(() => {
      const fetchData = async () => {
        const joinIRACollection = collection(db, FIREBASE_JOIN_IRA_COLLECTION);
        const joinIRADocuments  = await getDocs(joinIRACollection);
        const joinIRAData       = joinIRADocuments.docs.map(doc => doc.data());
        
        //Index 0 ===> joinIRA Buttons
        setJoinIraDataButton(joinIRAData[0] as JoinIraDataButton)
  
        //Index 1 ===> joinIRA Text
        setJoinIraDataText(joinIRAData[1] as JoinIraDataText)
    }  
    fetchData();
    }, [])
  
  
    return (
        <div className={styles.feature}>
        <div className={styles.frame36597}>
          <div className={styles.frame48095734}>
            <img className={styles.rectangle62} src="/img/rectangle-62.svg" />
          </div>
          <div className={styles.frame48095735}>
            <img className="rectangle-210" src="/img/rectangle-210.svg" />
          </div>
        </div>
        <div className={styles.frame48095733}>
          <div className={styles.frame303}>
            <div className={styles.comment}>{joinIraDataText.headerText[lang_]}</div>
            <div className={styles.iraAmbition}>
              {joinIraDataText.text1[lang_]}
              <br />
              <br />
              {joinIraDataText.text2[lang_]}
            </div>
            <div className="link-button">
              <div className="button2">
                <Link className={styles.joinIRALink} href={joinIraDataButton.JoinIRALink}>
                  <div className="rejoindre-ira2">{joinIraDataButton.JoinIRA[lang_]}</div>
                </Link>  
              </div>
              <div className="button3">
                <Link className={styles.startIRALink} href={joinIraDataButton.StartIRALink}>
                  <div className="je-d-marre2">{joinIraDataButton.StartIRA[lang_]}</div>
                </Link>  
              </div>
            </div>
          </div>
        </div>
      </div>

    )
}

export default HowToJoinIra