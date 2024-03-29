import { LegalNoticeTexts, defaultLangObject } from '../../types/types'
import { db } from '../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore/lite'
import { useEffect, useState } from 'react'

const useSharedLogicLegalNoticePage = () => {

    const FIREBASE_LN_PAGE_COLLECTION = 'LegalNotice'

    const defaultTosTexts = {
      mainTitle: defaultLangObject,
      mainContent: defaultLangObject
    }

    const [texts, setTexts] = useState<LegalNoticeTexts>(defaultTosTexts)
    
    useEffect(() => {
        
        const fetchData = async () => {
          const collection_ = collection(db, FIREBASE_LN_PAGE_COLLECTION);
          const documents  = await getDocs(collection_); 
          const data       = documents.docs.map(doc => doc.data());
          
          //Index 0 ===> About Page Texts
          const texts = data[0] as LegalNoticeTexts
          setTexts(texts) 
        }
        
        fetchData();
        
      }, [])
  
  return {texts, setTexts}
}

export default useSharedLogicLegalNoticePage