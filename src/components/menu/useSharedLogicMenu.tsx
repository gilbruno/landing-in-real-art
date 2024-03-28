import { useEffect, useState } from "react";
import { Lang, MenuData, defaultLangObject } from "../../types/types";
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';

const useSharedLogicMenu = () => {

    const FIREBASE_MENU_COLLECTION = 'Menu'

    const [isSticky, setSticky]   = useState(false);
    const [isMobile, setIsMobile] = useState(false)
    const [community, setCommunity] = useState<Record<Lang, string>>(defaultLangObject)
    const [team, setTeam]           = useState<Record<Lang, string>>(defaultLangObject)
    const [about, setAbout]         = useState<Record<Lang, string>>(defaultLangObject)
    const [resources, setResources] = useState<Record<Lang, string>>(defaultLangObject)
    const [communityLink, setCommunityLink] = useState<string>('')
    const [teamLink, setTeamLink]           = useState<string>('')
    const [aboutLink, setAboutLink]         = useState<string>('')
    const [resourcesLink, setResourcesLink] = useState<string>('')
    const [presale, setPresale]     = useState<Record<Lang, string>>(defaultLangObject)
    const [testnet, setTestnet]     = useState<Record<Lang, string>>(defaultLangObject)
  
    let lastScrollTop = 0; // To keep track of scroll direction
    
    useEffect(() => {    
      const fetchData = async () => {
        const menuCollection = collection(db, FIREBASE_MENU_COLLECTION);
        const menuDocuments = await getDocs(menuCollection);
        const menuData     = menuDocuments.docs.map(doc => doc.data() as MenuData);
        
        //Index 0 ===> Menu_Buttons
        setPresale(menuData[0].Presale)
        setTestnet(menuData[0].Testnet)
  
        //Index 1 ===> Menu_Elements
        setCommunity(menuData[1].Community)   
        setTeam(menuData[1].Team)
        setAbout(menuData[1].About)
        setResources(menuData[1].Resources)
        setCommunityLink(menuData[1].CommunityLink)   
        setTeamLink(menuData[1].TeamLink)
        setAboutLink(menuData[1].AboutLink)
        setResourcesLink(menuData[1].ResourcesLink)
  
     }
  
     fetchData();
  
     // Use Effect to stick the menu at the top when scrolling down
      const checkSticky = () => {
        const menu = document.getElementById('menu')
        if (menu) {
          // Calculate the scroll position at which the bottom of the menu reaches the bottom of the viewport
            // Calculate the distance from the top of the document to the bottom of the menu
          const menuBottomPosition = menu.offsetTop + menu.offsetHeight
  
          // Determine if the bottom of the menu is at or above the bottom of the viewport
          const isMenuBottomAtViewportBottom = menuBottomPosition <= window.scrollY + window.innerHeight
  
          if (isMenuBottomAtViewportBottom) {
              setSticky(true)
          } else {
              setSticky(false)
          }            
        }
      }
      window.addEventListener('scroll', checkSticky)
  
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 800)
      }
  
      checkScreenSize()
      window.addEventListener('resize', checkScreenSize)
  
      return () => {
          window.removeEventListener('scroll', checkSticky)
          window.removeEventListener('resize', checkScreenSize)
      }
    }, []);
  
    return {
        isSticky, isMobile,
        community, setCommunity, team, setTeam, about, setAbout, 
        resources, setResources, communityLink, setCommunityLink, 
        teamLink, setTeamLink, aboutLink, setAboutLink, 
        resourcesLink, setResourcesLink, presale, setPresale,
        testnet, setTestnet
    }
}

export default useSharedLogicMenu