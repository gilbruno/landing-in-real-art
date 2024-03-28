"use client"
import { ArtistMemberProps } from '../../../types/types'
import styles from './CarouselArtists.module.scss'
import parse from 'html-react-parser';

const Artist: React.FC<ArtistMemberProps> = ( {name, image, desc} ) => {
  return (
    <>
        <div className={styles["frame-artist-carousel"]}
          style={
            {
              backgroundImage: `url(${image})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundColor: 'black'
            }}
        >
          {/*<img id="photo-member" className={styles["photo-artist"]} alt="" src={image} />*/}
        </div>
        <div className={styles["frame-artist-description"]}>
            <div className={styles["wrapper-text"]}>
                <div className={styles["def"]}>
                    <div id="artistDesc" className={styles["artistDesc"]}>
                        {parse(desc)}
                    </div>
                </div>
                <div className={styles["frameArtistName"]}>
                    <div id="member-name" className={styles["artistName"]}>{name}</div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Artist