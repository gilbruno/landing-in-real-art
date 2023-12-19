"use client"
import { useEffect, useRef, useState } from "react";
import Link from 'next/link';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';
import { getDoc, doc } from "firebase/firestore";
import { useAppContext } from "../../context";
import LanguageSelector from "../LanguagaSelector";
import { Lang, MenuButtons, MenuData, MenuElements, defaultLangObject } from "../../types/types";



const Menu = () => {

  const {lang} = useAppContext()
  const lang_ = lang as Lang
  const [isSticky, setSticky] = useState(false);

  const FIREBASE_MENU_COLLECTION = 'Menu'
  
  const [community, setCommunity] = useState<string>('')
  const [team, setTeam]           = useState<string>('')
  const [about, setAbout]         = useState<string>('')
  const [resources, setResources] = useState<string>('')
  const [communityLink, setCommunityLink] = useState<string>('')
  const [teamLink, setTeamLink]           = useState<string>('')
  const [aboutLink, setAboutLink]         = useState<string>('')
  const [resourcesLink, setResourcesLink] = useState<string>('')
  const [presale, setPresale]     = useState<string>('')
  const [testnet, setTestnet]     = useState<string>('')

  const defaultMenuButtons = {
      Presale: defaultLangObject,
      Testnet: defaultLangObject
  }
  const defaultMenuElements = {
      About: defaultLangObject,
      Community: defaultLangObject,
      Team: defaultLangObject,
      Resources: defaultLangObject,
      AboutLink: '',
      CommunityLink: '',
      TeamLink: '',
      ResourcesLink: ''
  }

  const [menuButtons, setMenuButtons]    = useState<MenuButtons>(defaultMenuButtons)
  const [menuElements, setMenuElements] = useState<MenuElements>(defaultMenuElements)
  let lastScrollTop = 0; // To keep track of scroll direction
  
  useEffect(() => {
      const fetchData = async () => {
          const menuCollection = collection(db, FIREBASE_MENU_COLLECTION);
          const menuDocuments = await getDocs(menuCollection);
          const menuData     = menuDocuments.docs.map(doc => doc.data() as MenuData);
          
          //Index 0 ===> Menu_Buttons
          setMenuButtons(menuData[0] as MenuButtons)
          setPresale(menuData[0].Presale[lang_])
          setTestnet(menuData[0].Testnet[lang_])

          //Index 1 ===> Menu_Elements
          setMenuElements(menuData[1] as MenuElements)
          setCommunity(menuData[1].Community[lang_])   
          setTeam(menuData[1].Team[lang_])
          setAbout(menuData[1].About[lang_])
          setResources(menuData[1].Resources[lang_])
          setCommunityLink(menuData[1].CommunityLink)   
          setTeamLink(menuData[1].TeamLink)
          setAboutLink(menuData[1].AboutLink)
          setResourcesLink(menuData[1].ResourcesLink)

      }
  
      fetchData();

  }, [])

  
  useEffect(() => {
      // Menu_Buttons
      setPresale(menuButtons.Presale[lang_])
      setTestnet(menuButtons.Testnet[lang_])

      // Menu_Elements
      setCommunity(menuElements.Community[lang_])   
      setTeam(menuElements.Team[lang_])
      setAbout(menuElements.About[lang_])     
      setResources(menuElements.Resources[lang_])     
      setCommunityLink(menuElements.CommunityLink)   
      setTeamLink(menuElements.TeamLink)
      setAboutLink(menuElements.AboutLink)        
      setResourcesLink(menuElements.ResourcesLink)        
    }, [lang]);


  // Use Effect to stick the menu at the top when scrolling down
  useEffect(() => {    
      const checkSticky = () => {
          const scrollTop = window.scrollY;
          const menuElement = document.getElementById('menu');

          if (menuElement) {
          const menuOffsetTop = menuElement.offsetTop;
          
          // Determine scroll direction
          const scrollingDown = scrollTop > lastScrollTop;
          lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Update lastScrollTop, but never less than 0

          // Set 'isSticky' based on scroll position and direction
          if (scrollingDown && scrollTop >= menuOffsetTop) {
              setSticky(true);
          } else if (!scrollingDown) {
              setSticky(false);
          }
          }

          /*
          const scrollTop = window.scrollY;
          let divOffsetTop = document.getElementById('menu')?.offsetTop
          divOffsetTop = (divOffsetTop === undefined)?0:divOffsetTop
          setSticky(scrollTop >= divOffsetTop)
          */
      }
      window.addEventListener('scroll', checkSticky);
      return () => {
          window.removeEventListener('scroll', checkSticky);
  }
    }, []);


    const LogoIRAMenu = () => {
      return (
        <div className="logoIraMenu">
          <Link href="/home">
            <div className="fichier-3-12">
              <svg
                className="calque-1-22"
                width="33"
                height="34"
                viewBox="0 0 33 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29.4593 2.28516H2.96184C2.15179 2.28516 1.49512 2.94183 1.49512 3.75188V30.2493C1.49512 31.0594 2.15179 31.7161 2.96184 31.7161H29.4593C30.2693 31.7161 30.926 31.0594 30.926 30.2493V3.75188C30.926 2.94183 30.2693 2.28516 29.4593 2.28516Z"
                  fill="#F6F8FF"
                />
                <path
                  d="M10.66 20.1195C9.88809 19.3475 10.3513 17.9291 11.9756 16.6907M10.66 20.1195C11.3805 20.84 12.5674 19.859 13.5195 18.8554L11.9756 16.6907M10.66 20.1195L10.8165 19.963C10.5069 19.6534 10.426 19.2039 10.6269 18.6562C10.8301 18.1025 11.3185 17.4699 12.1097 16.8667L12.1102 16.8664C12.6217 16.4744 13.0147 16.1813 13.3532 15.9288C13.9636 15.4735 14.397 15.1503 15.029 14.6181L15.0299 14.6173C15.6448 14.094 15.7282 13.3013 15.6447 12.5753C15.5702 11.9274 15.3561 11.2758 15.2031 10.8103C15.1838 10.7515 15.1655 10.6957 15.1485 10.6432L15.1482 10.6422C14.7883 9.5475 14.2387 8.82343 13.515 8.37498C13.4126 8.31152 13.3073 8.25391 13.1991 8.20173H19.1453C18.974 8.28909 18.8141 8.38949 18.6655 8.50301C18.0112 9.00276 17.6023 9.73713 17.4012 10.664C17.1057 12.0014 16.8724 12.7446 16.631 13.2273C16.3962 13.6968 16.1518 13.9255 15.7978 14.2292C15.4073 14.5618 15.0271 14.8772 14.6717 15.172C14.087 15.657 13.5695 16.0863 13.1842 16.4452C12.876 16.7322 12.6287 16.9951 12.4979 17.2227C12.4327 17.3363 12.3814 17.4664 12.3879 17.6015C12.3952 17.7524 12.4726 17.8741 12.5932 17.957L12.5932 17.9571L12.6002 17.9616C12.7834 18.0776 13.0055 18.048 13.1958 17.9843C13.3951 17.9177 13.6198 17.794 13.858 17.6353C14.3364 17.3164 14.9123 16.8263 15.5174 16.26C16.7297 15.1254 18.0883 13.6567 19.0688 12.5603L19.069 12.5601C19.4767 12.103 19.96 11.7519 20.4254 11.6064C20.8809 11.4639 21.3082 11.5186 21.663 11.8533L21.6643 11.8544C21.9305 12.1017 21.9776 12.4792 21.7857 12.9633C21.5937 13.4475 21.1764 13.9862 20.6141 14.4597C20.0421 14.9414 19.6373 15.2199 19.2564 15.468C19.1851 15.5144 19.1143 15.56 19.043 15.6059C18.7327 15.8057 18.4148 16.0104 18.0213 16.3082C16.9273 17.1292 16.6056 18.1078 16.6056 19.0854C16.6056 19.567 16.6833 20.0459 16.7781 20.4997C16.8221 20.7102 16.8678 20.9074 16.912 21.0979C16.9664 21.333 17.0186 21.5579 17.0622 21.7851C17.3968 23.5644 17.792 24.6762 18.4528 25.3436C18.6389 25.5315 18.843 25.6813 19.067 25.8005H13.2163C13.4479 25.6849 13.6644 25.541 13.8643 25.3626C14.6165 24.6911 15.0908 23.5695 15.312 21.771C15.3663 21.3358 15.3872 20.9284 15.4068 20.5491C15.4085 20.5159 15.4102 20.4828 15.4119 20.4499C15.4333 20.0394 15.4563 19.6646 15.5197 19.3043C15.6442 18.5979 15.9254 17.9411 16.6859 17.2432C16.9799 16.9749 17.3331 16.675 17.6973 16.3656L17.7178 16.3482C18.0878 16.034 18.4678 15.7108 18.7998 15.408C19.1295 15.107 19.4222 14.8169 19.6118 14.5686C19.7056 14.4457 19.7852 14.3192 19.8265 14.1966C19.8679 14.0739 19.8835 13.9122 19.7775 13.7739L19.7775 13.7738C19.6365 13.59 19.4243 13.5548 19.2272 13.5857C19.0363 13.6156 18.8231 13.7103 18.6025 13.8382C18.1573 14.0964 17.6095 14.5341 17.0225 15.0577C15.8451 16.108 14.4662 17.5444 13.3595 18.7026L13.359 18.7031C12.8854 19.2023 12.37 19.6773 11.8956 19.9405C11.6589 20.0718 11.449 20.1409 11.2707 20.1459C11.1015 20.1506 10.9519 20.0984 10.8165 19.963L10.66 20.1195ZM11.9756 16.6907C12.4933 16.2941 12.8882 15.9996 13.2269 15.747C13.8331 15.2949 14.2592 14.9771 14.8865 14.4488L11.9756 16.6907Z"
                  fill="#5552FF"
                  stroke="#5552FF"
                  strokeWidth="0.442528"
                />
                <path
                  d="M1.66614 1.00647H30.7593C31.5594 1.00647 32.208 1.65509 32.208 2.4552V31.5484C32.208 32.3485 31.5594 32.9971 30.7593 32.9971H1.66614C0.866029 32.9971 0.217409 32.3485 0.217409 31.5484V2.4552C0.217409 1.65509 0.866029 1.00647 1.66614 1.00647Z"
                  stroke="#F6F8FF"
                  strokeWidth="0.434819"
                  strokeMiterlimit="10"
                />
              </svg>
            </div>
            <svg
              className="ira2"
              width="61"
              height="22"
              viewBox="0 0 61 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.276367 0.378906H6.87535V21.6203H0.276367V0.378906Z"
                fill="#F6F8FF"
              />
              <path
                d="M15.0973 9.55518H22.5176C23.3484 9.55518 23.9904 9.36636 24.4435 8.98874C24.9155 8.61112 25.1516 8.06356 25.1516 7.34607C25.1516 6.62859 24.9155 6.08103 24.4435 5.70341C23.9904 5.32578 23.3484 5.13697 22.5176 5.13697H14.1627L17.1365 2.07822V21.6203H10.5375V0.378906H23.5089C25.1515 0.378906 26.596 0.671565 27.8421 1.25688C29.0883 1.8422 30.0607 2.65409 30.7593 3.69256C31.4579 4.73103 31.8072 5.94886 31.8072 7.34607C31.8072 8.70552 31.4579 9.91392 30.7593 10.9713C30.0607 12.0097 29.0883 12.8216 27.8421 13.4069C26.596 13.9734 25.1515 14.2566 23.5089 14.2566H15.0973V9.55518ZM17.9295 11.6793H25.2648L32.5719 21.6203H25.0099L17.9295 11.6793Z"
                fill="#F6F8FF"
              />
              <path
                d="M39.2158 17.7968V12.529H53.7732V17.7968H39.2158ZM50.9693 0.378906L60.4854 21.6203H53.4333L45.7298 3.23941H47.5141L39.7822 21.6203H32.7584L42.2462 0.378906H50.9693Z"
                fill="#F6F8FF"
              />
            </svg>
          </Link>
      </div>
      )
    }

    
    return (
        <div className="header">
          <LogoIRAMenu/>
          <div className="wrapper-link">
            <div className="wrapper-link-menu">
              <div className="link-text"></div>
              <div className="link-text2">
                <div className="communaut">
                  <Link className="menu-link-element" href={communityLink}>
                    {community}
                  </Link>
                </div>
              </div>
              <div className="link-text2">
                <div className="equipe">
                  <Link className="menu-link-element" href={teamLink}>
                    {team}
                  </Link>
                </div>
              </div>
              <div className="link-text2">
                <div className="a-propos2">
                  <Link className="menu-link-element" href={aboutLink}>
                    {about}
                  </Link>
                </div>
              </div>
              <div className="link-text2">
                <div className="ressources">
                  <Link className="menu-link-element" href={resourcesLink}>
                    {resources}
                  </Link>
                </div>
              </div>
            </div>
            <div className="wrapper-button">
              <div className="menu-button-presale">
                <div className="pr-vente">
                  <Link href="/presale">
                    <div className="text-wrapper-5">{presale}</div> 
                  </Link>    
                </div>
              </div>
              <div className="button2">
                <div className="testnet">{testnet}</div>
              </div>
            </div>

            <LanguageSelector/>
            
          </div>
        </div>

        )
}

export default Menu
