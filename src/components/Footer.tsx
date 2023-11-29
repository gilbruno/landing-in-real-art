"use client"
import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';
import { useAppContext } from '../context';
import Link from 'next/link';


const Footer = () => {

    //Get the language of the global context
    const {lang, setLang} = useAppContext()

    const FIREBASE_FOOTER_COLLECTION = 'Footer'

    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    useEffect(() => {
        const fetchText = async () => {
            const textDoc      = collection(db, FIREBASE_FOOTER_COLLECTION);
            const textSnapshot = await getDocs(textDoc);
            const textList     = textSnapshot.docs.map(doc => doc.data());
            const email   = textList[0]['Email'];
            const phone   = textList[0]['Telephone'];
            const address = textList[0]['Adresse'];
            setEmail(email)   
            setPhone(phone)
            setAddress(address)
        }
    
        fetchText();
        
      }, [lang]);

    return (
        <>
            <div className="footer">
                <div className="frame-12">
                    <img className="logo-2" alt="Logo" src="/img/logo-IRA.png" />
                    <div className="logo-social-network">
                        <Link href="/">
                            <img className="add" alt="Frame" src="/img/linkedin-logo.png" />
                        </Link>
                        <Link href="/">
                            <img className="add" alt="Frame" src="/img/instagram-logo.png" />
                        </Link>
                        <Link href="/">
                            <img className="add" alt="Frame" src="/img/twitter-logo.png" />
                        </Link>
                        
                    </div>
                    <p className="text-wrapper-9">Rendez physique vos œuvres digital</p>
                </div>
                <div className="frame-14">
                    <div className="group-9">
                    <div className="text-wrapper-10">Nos pages</div>
                    <div className="text-wrapper-11">Accueil</div>
                    <div className="text-wrapper-12">A propos</div>
                    <div className="text-wrapper-13">Marketplace</div>
                    <div className="text-wrapper-14">FAQ</div>
                    </div>
                    <div className="group-10">
                    <div className="text-wrapper-10">Entreprise</div>
                    <div className="text-wrapper-11">Equipes</div>
                    <div className="text-wrapper-12">Partenaire</div>
                    <div className="text-wrapper-13">CGU</div>
                    </div>
                    <img className="line-2" alt="Line" src="/img/line-5.svg" />
                    <div className="group-11">
                    <div className="text-wrapper-10">Contact</div>
                    <p className="text-wrapper-11">{phone}</p>
                    <div className="text-wrapper-12">{address}</div>
                    <div className="text-wrapper-13">{email}</div>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default Footer