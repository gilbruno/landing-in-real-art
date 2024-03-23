"use client"
import styles from './Team.module.scss'
import { useEffect, useState } from "react"
import { useAppContext } from "../../../context"
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../firebaseConfig";
import { Lang, MemberData, defaultLangObject } from "../../../types/types";
import TeamMember from "./TeamMember";
import { Carousel } from 'react-bootstrap';

const Team = () => {

      //Get the language of the global context
      const {lang} = useAppContext()
      const lang_ = lang as Lang
  
      const FIREBASE_TEAM_COLLECTION = 'Team'
      
      const [text1, setText1] = useState<string>('')
      const [text2, setText2] = useState<string>('')
      const [role, setRole]   = useState<string>('')
      const [name, setName]   = useState<string>('')
      const [photoUrl, setPhotoUrl]           = useState<string>('')
      const [currentIndex, setCurrentIndex]   = useState(0)
      const [members, setMembers]             = useState<MemberData>([])
      const [title, setTitle]                = useState<Record<Lang, string>>(defaultLangObject)
      const [isLoading, setIsLoading] = useState(false);

      const setMembersData = async(currentIndex: number, members: MemberData) => {
        setText1(members[currentIndex].text1[lang_])
        setText2(members[currentIndex].text2[lang_])
        setRole(members[currentIndex].role[lang_])
        setName(members[currentIndex].name)
        const photo_ = members[currentIndex].photo 
        const imageRef = ref(storage, photo_)
        const url = await getDownloadURL(imageRef)
        //photo-team-member
        setPhotoUrl(url)
      }
  
      async function getUrlPhoto(photo: string): Promise<string> {
        const imageRef = ref(storage, photo)
        const urlPhoto = await getDownloadURL(imageRef)
        return urlPhoto;
      }


      async function transformMemberPhotos(members: MemberData): Promise<MemberData> {
          const promises = members.map(async member => ({
              ...member,
              photo: await getUrlPhoto(member.photo)
          }))
          return Promise.all(promises);
      }

      //--------------------------------------------------------------------- useEffect
      /**
       * UseEffect called at the first page loading 
       */
      useEffect(() => {
        const fetchTeamMembers = async () => {
          const teamCollection = collection(db, FIREBASE_TEAM_COLLECTION);
          const teamDocuments  = await getDocs(teamCollection);
          const teamData       = teamDocuments.docs.map(doc => doc.data());
          let members_ = teamData[0]['members'] as MemberData
          const members_tmp = await transformMemberPhotos(members_)
          const title_ = teamData[0]['title'] as Record<Lang, string>
          setMembers(members_tmp)        
          setMembersData(currentIndex, members_)
          setTitle(title_)
        }
        fetchTeamMembers()
        
      }, [])
  
      //--------------------------------------------------------------------- useEffect
      /**
       * UseEffect called when 'lang' or 'currentIndex' has changed
       */
      /*
      useEffect(() => {
        
        if (members.length !== 0) {
          setMembersData(currentIndex, members)

          setIsLoading(true)
          const img = new Image()
          img.src = photoUrl
          img.onload = () => {
            // Introduce a slight delay
            setTimeout(() => {
              setIsLoading(false)
            }, 800); // Adjust the delay as needed
          }
        }

      }, [lang, currentIndex])
  
  
      
      const handleArrowClick = (direction: string) => {
        if (direction === 'right') {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % members.length);
        } else {
          setCurrentIndex((prevIndex) => (prevIndex - 1 + members.length) % members.length);
        }
      }

      useEffect(() => {
        const dynamicImageElement = document.getElementById('photo-member');
        const paragraph1 = document.getElementById('team-member-p-1');
        const paragraph2 = document.getElementById('team-member-p-2');
        const memberName = document.getElementById('member-name');
        const memberRole = document.getElementById('member-role');

        console.log(dynamicImageElement)
        if (isLoading 
            && dynamicImageElement !== null 
            && paragraph1 !== null 
            && paragraph2 !== null
            && memberName !== null
            && memberRole !== null
            ) {
          dynamicImageElement.style.opacity = '0';
          paragraph1.style.opacity = '0';
          paragraph2.style.opacity = '0';
          memberName.style.opacity = '0';
          memberRole.style.opacity = '0';
        } else {
          if (dynamicImageElement !== null 
            && paragraph1 !== null 
            && paragraph2 !== null
            && memberName !== null
            && memberRole !== null
            ) {
            dynamicImageElement.style.transition = 'opacity 0.5s ease;';
            paragraph1.style.transition = 'opacity 0.5s ease;';
            paragraph2.style.transition = 'opacity 0.5s ease;';
            memberName.style.transition = 'opacity 0.5s ease;';
            memberRole.style.transition = 'opacity 0.5s ease;';
            dynamicImageElement.style.opacity = '1';
            paragraph1.style.opacity = '1';
            paragraph2.style.opacity = '1';
            memberName.style.opacity = '1';
            memberRole.style.opacity = '1';
          }
        }
      }, [isLoading]);

*/

    return (
      <div id="team" >
          <div className={styles.teamTitle}>
              {title[lang_]}
          </div>
          <div className={styles["frame-team-carousel"]}>
            <Carousel interval={10000}>
                  {
                      members.map(
                          (member, index) => (
                              <Carousel.Item key={index}> 
                                  <TeamMember name={member.name} photo={member.photo} role={member.role[lang_]} text1={member.text1[lang_]} text2={member.text2[lang_]}/>
                              </Carousel.Item>
                              
                          )
                      )
                  }

          </Carousel>

          {
          /*  
          <div id="team" className={styles["frame-team"]}>
            <div className={classNames(styles["arrow"], styles["left-arrow"])} >
              <img alt="left" src="img/angle-circle-left.png" onClick={() => handleArrowClick('left')}/>
            </div>
            <TeamMember name={name} photo={photoUrl} role={role} text1={text1} text2={text2}/>
            <div className={classNames(styles["arrow"], styles["right-arrow"])} >
              <img alt="right" src="img/angle-circle-right.png" onClick={() => handleArrowClick('right')}/>
            </div>
          </div>
            */
          }
        </div>
      </div>
    )
}

export default Team