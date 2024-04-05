import { OrdersTexts, defaultLangObject } from '../../types/types'
import { db } from '../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore/lite'
import { useEffect, useState } from 'react'

const useSharedLogicOrders = (fireBaseOrdersPageCollection:string) => {

    const defaultTosTexts = {
      mainTitle: defaultLangObject,
      web3Connection: {
        msgConnected: defaultLangObject,
        msgNotConnected: defaultLangObject
    },
    }

    const [texts, setTexts] = useState<OrdersTexts>(defaultTosTexts)
    
    useEffect(() => {
        
        const fetchData = async () => {
          const collection_ = collection(db, fireBaseOrdersPageCollection);
          const documents  = await getDocs(collection_); 
          const data       = documents.docs.map(doc => doc.data());
          
          //Index 0 ===> About Page Texts
          const texts = data[0] as OrdersTexts
          setTexts(texts) 
        }
        
        fetchData();
        
      }, [])
  
  return {texts, setTexts}
}

export default useSharedLogicOrders