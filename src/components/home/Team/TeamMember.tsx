"use client"
import styles from './Team.module.scss'
import { TeamMemberProps } from "../../../types/types"

const TeamMember: React.FC<TeamMemberProps> = ( {name, photo, role, text1, text2} ) => {
  return (
    <>
        <div className={styles["frame-team-member-carousel"]} 
          style={
            {
              backgroundImage: `url(${photo})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundColor: 'linear-gradient(135.65deg, rgb(236, 238, 250) 0%, rgb(234, 236, 251) 52.6041686535%, rgb(225, 229, 255) 100%))'
            }}
          >
          
        </div>
        <div className={styles["colum"]}>
        <div className={styles["wrapper-text"]}>
            <div className={styles["def"]}>
            <div id="team-member-p-1" className={styles["team-member-p-1"]}>
                {text1}
            </div>
            <div id="team-member-p-2" className={styles["team-member-p-2"]}>
                {text2}
            </div>
            </div>
            <div className={styles["chara-carousel"]}>
            <div id="member-name" className={styles["member-name-carousel"]}>{name}</div>
            <div id="member-role" className={styles["member-role-carousel"]}>{role}</div>
            </div>
        </div>
        
        </div>
    </>
  )
}

export default TeamMember