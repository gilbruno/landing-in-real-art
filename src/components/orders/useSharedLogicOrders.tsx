import { OrdersButtons, OrdersTexts, defaultLangObject } from '../../types/types'
import { db } from '../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore/lite'
import { useEffect, useState } from 'react'
import { fetchOrders } from '../../lib/presaleArtworkOrder';
import type { presaleArtworkOrder } from '@prisma/client'

const useSharedLogicOrders = (fireBaseOrdersPageCollection:string) => {

    const defaultTexts = {
      mainTitle: defaultLangObject,
      web3Connection: {
        msgConnected: defaultLangObject,
        msgNotConnected: defaultLangObject
      },
    }

    const defaultButtons = {
      cancelOrder: defaultLangObject
    }

    const defaultOrder = {
      id: BigInt(0),
      artistName: '', 
      artworkName: '', 
      hashArt: '',
      tokenId: BigInt(0),
      txHash: '',
      owner: ''
    }

    const [texts, setTexts] = useState<OrdersTexts>(defaultTexts)
    const [buttons, setButtons] = useState<OrdersButtons>(defaultButtons)
    let [orders, setOrders] = useState<Array<presaleArtworkOrder>>([defaultOrder])
    useEffect(() => {
        
        //Fetch in Firebase
        const fetchFirebaseData = async () => {
          const collection_ = collection(db, fireBaseOrdersPageCollection)
          const documents  = await getDocs(collection_)
          const data       = documents.docs.map(doc => doc.data())

          //Index 0 ===> Orders Buttons
          const buttons = data[0] as OrdersButtons
          setButtons(buttons) 
          
          //Index 1 ===> Orders Texts
          const texts = data[1] as OrdersTexts
          setTexts(texts) 
        }

        //Fetch in the Postgres Database
        const fetchDatabaseData = async () => {
          const orders_ = await fetchOrders()
          setOrders(orders_)
        }

        fetchFirebaseData()
        fetchDatabaseData()
      }, [])
  
  return {texts, setTexts, buttons, setButtons, orders, setOrders}
}

export default useSharedLogicOrders