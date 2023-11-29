"use client"
import { useEffect, useState } from 'react'
import Add1 from '../components/Add1'
import { useAppContext } from '../context'
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';


const HelpIra = () => {
  
  //Get the language of the global context
  const {lang } = useAppContext()

  const FIREBASE_FAQ_COLLECTION = 'Faq'
  const FIREBASE_KEY_FAQ_MAIN   = 'faqMain'
  const FIREBASE_KEY_QUESTION1  = 'question1'
  const FIREBASE_KEY_QUESTION2  = 'question2'
  const FIREBASE_KEY_QUESTION3  = 'question3'
  const FIREBASE_KEY_READ_FAQ   = 'readFaq'
  
  let LANGUAGE                  = lang

  const [question1, setQuestion1] = useState<string>('');
  const [question2, setQuestion2] = useState<string>('');
  const [question3, setQuestion3] = useState<string>('');
  const [faqMain, seFaqMain]      = useState<string>('');
  const [readFaq, setReadFaq]      = useState<string>('');
  const [isAnswer1Visible, setIsAnswer1Visible] = useState<boolean>(false);
  const [imageExpandQuestion1, setImageExpandQuestion1] = useState<string>("/img/plus_16px.png");
  const [imageExpandQuestion2, setImageExpandQuestion2] = useState<string>("/img/plus_16px.png");
  const [imageExpandQuestion3, setImageExpandQuestion3] = useState<string>("/img/plus_16px.png");

  useEffect(() => {

    const fetchText = async () => {
        const faqCollection = collection(db, FIREBASE_FAQ_COLLECTION);
        const faqDocuments  = await getDocs(faqCollection);
        const faqData       = faqDocuments.docs.map(doc => doc.data());
        //console.log(faqData)  
        //Index 0 ===> FAQ Buttons
        setReadFaq(faqData[0][FIREBASE_KEY_READ_FAQ][LANGUAGE])
        
        //Index 1 ===> FAQ Text
        seFaqMain(faqData[1][FIREBASE_KEY_FAQ_MAIN][LANGUAGE])
        setQuestion1(faqData[1][FIREBASE_KEY_QUESTION1][LANGUAGE])
        setQuestion2(faqData[1][FIREBASE_KEY_QUESTION2][LANGUAGE])
        setQuestion3(faqData[1][FIREBASE_KEY_QUESTION3][LANGUAGE])
    }
    fetchText();

  }, [lang]);

  const showAnswer1 = () => {
    setIsAnswer1Visible(true)
    setImageExpandQuestion1("/img/minus_16px.png")
  }
  const hideModal = () => {
    setIsAnswer1Visible(false)
    setImageExpandQuestion1("/img/plus_16px.png")
  }  
  
    return (
        <div className="group-3">
          <div className="wrapper">
            <div className="question">
              <p className="text-wrapper-3">{question1}</p>
              <div onClick={showAnswer1}>
                <img className="plus" alt="plus" src={imageExpandQuestion1} />
              </div>
            </div>
            {isAnswer1Visible && (
              <div className="answer">
                LoremIpsum
              </div>
              )}
            <div className="question">
              <div className="text-wrapper-3">{question2}</div>
              <img className="plus" alt="plus" src="/img/plus_16px.png" />
            </div>
            <div className="answer">
              LoremIpsum
            </div>
            <div className="question">
              <p className="text-wrapper-3">{question3}</p>
              <img className="plus" alt="plus" src="/img/plus_16px.png" />
            </div>
          </div>
          <div className="frame-9">
            <div className="text-wrapper-2">FAQ</div>
            <p className="text-wrapper-4">
              {faqMain}
            </p>
            <div className="link-button">
              <button className="button">
                <div className="text-wrapper-5">{readFaq}</div>
              </button>
            </div>
          </div>
        </div>


    )

}

export default HelpIra