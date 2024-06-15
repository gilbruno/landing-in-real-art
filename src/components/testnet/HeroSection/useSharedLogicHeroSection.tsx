import { useEffect, useState } from "react";
import { HeaderButtons, HeaderTexts, defaultLangObject } from "../../../types/types";
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';

const useSharedLogicHeroSection = () => {

  const FIREBASE_HEADER_COLLECTION = 'Header'

  const defaultHeaderButtons = {
    button1: defaultLangObject,
    button2: defaultLangObject,
    button1Link: '',
    button2Link: '',
  }

  const defaultHeaderTexts = {
    registrationFormDescription: defaultLangObject,
    registrationFormTitle: defaultLangObject,
    title1: defaultLangObject,
    title2: defaultLangObject,
    text1: defaultLangObject
  }
  const [headerButtons, setHeaderButtons] = useState<HeaderButtons>(defaultHeaderButtons);
  const [headerTexts, setHeaderTexts] = useState<HeaderTexts>(defaultHeaderTexts);

  useEffect(() => {
    const fetchData = async () => {
      const headerCollection = collection(db, FIREBASE_HEADER_COLLECTION);
      const headerDocuments  = await getDocs(headerCollection); 
      const headerData       = headerDocuments.docs.map(doc => doc.data());
      //Index 0 ===> Header_Buttons
      setHeaderButtons(headerData[0] as HeaderButtons)

      //Index 1 ===> Header Text
      setHeaderTexts(headerData[1] as HeaderTexts)
    }

    fetchData();
  }, [])

  return {headerButtons, setHeaderButtons, headerTexts, setHeaderTexts}
}

export default useSharedLogicHeroSection