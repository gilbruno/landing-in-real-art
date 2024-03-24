import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore/lite";
import { TestnetProsTexts, defaultLangObject } from "../../../types/types";

const useSharedLogicTestnetPros = () => {
  const FIREBASE_COLLECTION = "Testnet_Pros";

  const defaultInvestmentCard = {
    number: defaultLangObject,
    title1: defaultLangObject,
    urlLink: "",
    backgroundImage: "",
  };

  const defaultTestnetProsTexts = {
    header: { title: defaultLangObject, description: defaultLangObject },
    card1: defaultInvestmentCard,
    card2: defaultInvestmentCard,
    card3: defaultInvestmentCard,
    card4: defaultInvestmentCard,
  };

  const [texts, setTexts] = useState<TestnetProsTexts>(defaultTestnetProsTexts);

  useEffect(() => {
    const fetchData = async () => {
      const collection_ = collection(db, FIREBASE_COLLECTION);
      const documents = await getDocs(collection_);
      const data = documents.docs.map((doc) => doc.data());

      //Index 0 ===> Testnet Pros Texts
      const texts = data[0] as TestnetProsTexts;
      setTexts(texts);
    };

    fetchData();
  }, []);

  return { texts, setTexts };
};

export default useSharedLogicTestnetPros;
