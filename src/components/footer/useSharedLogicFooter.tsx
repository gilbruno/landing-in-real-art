import { getDownloadURL, ref } from "firebase/storage"
import { storage } from "../../firebaseConfig"
import { useEffect, useState } from 'react'
import { db } from '../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore/lite'
import { FooterBlock, FooterData, FooterTexts, Lang, defaultLangObject } from "../../types/types"
import { useAppContext } from "../../context"


const useSharedLogicFooter = () => {

    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang
    
    const FIREBASE_FOOTER_COLLECTION = 'Footer'

    const [contactTitle, setContactTitle] = useState<Record<Lang, string>>(defaultLangObject);
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [twitterLogo, setTwitterLogo]     = useState("")
    const [linkedInLogo, setLinkedInLogo]   = useState("")
    const [instagramLogo, setInstagramLogo] = useState("")
    const [twitterUrl, setTwitterUrl]       = useState("")
    const [linkedInUrl, setLinkedInUrl]     = useState("")
    const [instagramUrl, setInstagramUrl]   = useState("")
    const [leftBlockText, setLeftBlockText] = useState<Record<Lang,string>>(defaultLangObject)

    const defaultFooterBlock = {
        title: defaultLangObject,
        lines: []
    }

    const defaultFooterTexts = {
        emailTitle: defaultLangObject,
        emailPlaceHolder: defaultLangObject
    }

    const [footerBlock1, setFooterBlock1] = useState<FooterBlock>(defaultFooterBlock)
    const [footerBlock2, setFooterBlock2] = useState<FooterBlock>(defaultFooterBlock)
    const [texts, setTexts]               = useState<FooterTexts>(defaultFooterTexts)

    useEffect(() => {
        const fetchData = async () => {
            const dataDoc      = collection(db, FIREBASE_FOOTER_COLLECTION);
            const dataSnapshot = await getDocs(dataDoc);
            const dataList     = dataSnapshot.docs.map(doc => doc.data() as FooterData<string>);
            
            //Left block
            const imageRefTwitter   = ref(storage, 'footer/twitter-x-logo.png')
            const imageRefLinkedIn  = ref(storage, 'footer/linkedin-logo.png') 
            const imageRefInstagram = ref(storage, 'footer/instagram-logo.png')
            const urlTwitter   = await getDownloadURL(imageRefTwitter)
            const urlLinkedIn  = await getDownloadURL(imageRefLinkedIn) 
            const urlInstagram = await getDownloadURL(imageRefInstagram)
            setTwitterLogo(urlTwitter)
            setLinkedInLogo(urlLinkedIn)
            setInstagramLogo(urlInstagram)   
            setTwitterUrl(dataList[1].twitterUrl)
            setInstagramUrl(dataList[1].instagramUrl)
            setLinkedInUrl(dataList[1].linkedInUrl)
            const leftBlockText_ = dataList[1].text
            setLeftBlockText(leftBlockText_)

            //Links block
            setFooterBlock1(dataList[2].block1)
            setFooterBlock2(dataList[2].block2)

            //Right block  
            const contactTitle = dataList[0]['contactTitle'];
            const email   = dataList[0].Email;
            const phone   = dataList[0].Telephone;
            const address = dataList[0].Adresse;
            setEmail(email)   
            setPhone(phone)
            setAddress(address)
            setContactTitle(contactTitle)
            
            //Texts
            setTexts(dataList[3] as FooterTexts)
        }
    
        fetchData()
        
      }, [])

      return {
            contactTitle, setContactTitle, email, setEmail, phone, setPhone, address, setAddress, twitterLogo, setTwitterLogo, 
            linkedInLogo, setLinkedInLogo, instagramLogo, setInstagramLogo, twitterUrl, setTwitterUrl, linkedInUrl, setLinkedInUrl,
            instagramUrl, setInstagramUrl, leftBlockText, setLeftBlockText,
            footerBlock1, setFooterBlock1,
            footerBlock2, setFooterBlock2,
            texts, setTexts
        }

}

export default useSharedLogicFooter