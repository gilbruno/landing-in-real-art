"use client"
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './CarouselArtists.module.scss'
import Carousel from 'react-bootstrap/Carousel'
import { ArtistNameDesc, Artists, ArtistsData, Lang, defaultLangObject } from '../../../types/types'
import { ListResult, StorageReference, getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../../../firebaseConfig";
import { useAppContext } from "../../../context";
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore/lite';
import Artist from './Artist'
import Link from 'next/link'

const CarouselArtists = () => {

    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang
    const FIREBASE_ARTISTS_COLLECTION = 'Artists'
    
    const defaultArtistsTexts = {
        title: defaultLangObject,
        description: defaultLangObject
    }

    const [allArtists, setAllArtists]   = useState<Array<ArtistNameDesc>>([])
    const [title, setTitle]             = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [artistsTexts, setArtistsTexts] = useState<ArtistsData>(defaultArtistsTexts);
  
    //--------------------------------------------------------------------- useEffect
    /**
     * UseEffect called at the first loading : cache all the images Url we get 
     * from Firstore to be used after
     */
    useEffect(() => {
  
        const getUrl = (image: string) => {
          const imageRef = ref(storage, `artists/${image}`)
          return getDownloadURL(imageRef)
        } 
  
        const fetchTexts = async() => {
            const artistsCollection = collection(db, FIREBASE_ARTISTS_COLLECTION);
            const artistsDocuments  = await getDocs(artistsCollection);
            const artistsData       = artistsDocuments.docs.map(doc => doc.data());
            setTitle(artistsData[1].title[lang])
            setDescription(artistsData[1].description[lang])
            //Index 1 ===> Header Text
            setArtistsTexts(artistsData[1] as ArtistsData)
        }
  
        const fetchArtistsNameAndDesc = async() => {
            const artistsCollection = collection(db, FIREBASE_ARTISTS_COLLECTION);
            const artistsDocuments  = await getDocs(artistsCollection);
            const artistsData       = artistsDocuments.docs.map(doc => doc.data());
            //Index 0 
            const allArtists_ = artistsData[0]['artists'] as Artists
            for (let i = 0; i < allArtists_.length; i++) {
                const imageName = allArtists_[i].image
                const urlImage = (imageName)?await getUrl(imageName):''
                allArtists_[i].image = urlImage
            }    
            setAllArtists(allArtists_)
        }
  
        fetchTexts()
        fetchArtistsNameAndDesc()
        
        
    }, [])

  return (
    <div id="artists">
        <div className={styles.frame3349}>
            <div className={styles.nosArtistes}>{artistsTexts.title[lang_]}</div>
            <div className={styles.artistsDescription}>
                {artistsTexts.description[lang_]}
            </div>
        </div>

        <div className={styles["frame-artists-carousel"]}>
            <Carousel interval={10000}>
                    {
                        allArtists.map(
                            (record, index) => (
                                <Carousel.Item key={index}> 
                                <Link href="/presale#dropPanel">
                                    <Artist name={record.name} image={record.image} desc={record.desc[lang_]} />
                                    </Link>
                                </Carousel.Item>
                                
                            )
                        )
                    }

            </Carousel>
        </div>
    </div>

    
  )
}

export default CarouselArtists