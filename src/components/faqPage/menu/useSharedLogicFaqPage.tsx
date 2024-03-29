import { FaqPage, FaqQuestions, defaultLangObject } from '../../../types/types'
import { db } from '../../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore/lite'
import { useEffect, useState } from 'react'

const useSharedLogicFaqPage = () => {

    const FIREBASE_FAQ_PAGE_COLLECTION = 'Faq'

    const defaultFaqItems = [
        {
            answer: defaultLangObject,
            question: defaultLangObject
        }
    ]
    const defaultFaqPage = {
        faqNFT: {
            items: defaultFaqItems,
            textButton: defaultLangObject
        },
        faqProject: {
            items: defaultFaqItems,
            textButton: defaultLangObject
        }
    }

    const defaultFaqQuestion = {
        answer: defaultLangObject,
        question: defaultLangObject
    }

    const defaultFaqQuestions = {
        items: [defaultFaqQuestion]
    }

    const [faqPage, setFaqPage] = useState<FaqPage>(defaultFaqPage)
    const [currentFaqQuestions, setCurrentFaqQuestions] = useState<FaqQuestions>(defaultFaqQuestions);
    
    useEffect(() => {
        const fetchData = async () => {
          const collection_ = collection(db, FIREBASE_FAQ_PAGE_COLLECTION);
          const documents  = await getDocs(collection_); 
          const data       = documents.docs.map(doc => doc.data());
          
          //Index 1 ===> Faq Page
          const faqPage = data[1] as FaqPage
          setCurrentFaqQuestions(faqPage.faqProject)
          setFaqPage(faqPage) 
        }
        
        fetchData();
        
      }, [])
  
  return {faqPage, setFaqPage, currentFaqQuestions, setCurrentFaqQuestions}
}

export default useSharedLogicFaqPage