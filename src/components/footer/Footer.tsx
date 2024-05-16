"use client"
import styles from './Footer.module.css'
import { useAppContext } from '../../context';
import Link from 'next/link';
import { Lang } from '../../types/types';
import useSharedLogicFooter from './useSharedLogicFooter'
import Image from 'next/image';

const Footer = () => {

    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang
    const {
        contactTitle, setContactTitle, email, setEmail, phone, setPhone, address, setAddress, twitterLogo, setTwitterLogo, 
        linkedInLogo, setLinkedInLogo, instagramLogo, setInstagramLogo, twitterUrl, setTwitterUrl, linkedInUrl, setLinkedInUrl,
        instagramUrl, setInstagramUrl, leftBlockText, setLeftBlockText,
        footerBlock1, setFooterBlock1,
        footerBlock2, setFooterBlock2
      } = useSharedLogicFooter()

      
    return (
        <>
            <div className={styles.footer}>
                <div className={styles["footer-left"]}>
                    <img className={styles["logo-2"]} alt="" src="/img/logo-IRA.png" />
                    <div className={styles["logo-social-network"]}>
                        <Link href={linkedInUrl}>
                            <img className={styles["add"]} alt="Frame" src={linkedInLogo} />
                        </Link>
                        <Link href={instagramUrl}>
                            <img className={styles["add"]} alt="Frame" src={instagramLogo} />
                        </Link>
                        <Link href={twitterUrl}>
                            <img className={styles["add"]} alt="Frame" src={twitterLogo} />
                        </Link>
                        
                    </div>
                    <p className={styles.footerLeftFooter}>{leftBlockText[lang_]}</p>
                </div>
                <div className={styles["footer-right"]}>
                    {/** BLOCK 1**/}
                    <div className={styles.footerBlock1}>
                        <div className={styles.footerBlock1Title}>{footerBlock1.title[lang_]}</div>
                        {
                            footerBlock1.lines.map(
                                (line, index) => (
                                    <div key={index} className={styles.footerBlockLine}>
                                        <Link className={styles.footerLink} href={line.url}>
                                            {line.text[lang_]}
                                        </Link>    
                                    </div>            
                                )
                            )
                        }
                    </div>

                    {/** BLOCK 2 **/}
                    <div className={styles.footerBlock2}>
                    <div className={styles.footerBlock1Title}>{footerBlock2.title[lang_]}</div>

                    {
                            footerBlock2.lines.map(
                                (line, index) => (
                                    <div key={index} className={styles.footerBlockLine}>
                                        <Link className={styles.footerLink} href={line.url}>
                                            {line.text[lang_]}
                                        </Link>    
                                    </div>            
                                )
                            )
                        }

                    </div>

                    <Image className={styles.line2} alt="Line" src="/img/line-5.svg" width={1} height={196} />
                    
                    {/** BLOCK CONTACT **/}
                    <div className={styles.footerContact}>
                        <div className={styles.footerBlock1Title}>{contactTitle[lang_]}</div>  
                        <a href={`tel:${phone}`} className={styles.footerBlockLine}>{phone}</a>
                        <div className={styles.footerBlockLine}>{address}</div>
                        <a href={`mailto:${email}`} className={styles.footerBlockLine}>{email}</a>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default Footer