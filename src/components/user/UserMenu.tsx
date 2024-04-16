import { useState } from "react";
import styles from "./UserMenu.module.scss"
import Link from "next/link";

export interface UserMenuProps {
    isClosed: boolean
  }

  
const UserMenu = (props: UserMenuProps) => {
    const { isClosed } = props
    const [showDropdown, setShowDropdown] = useState(false);
    console.log('isClosed', isClosed)
    console.log('showDropdown', showDropdown)
    const closeMenu = () => {
      setShowDropdown(false); 
    }
  
    return (
        <div className={styles.userMenuSelector}>
            {(showDropdown && !isClosed) && (
                <div className={styles.dropdown}>
                    <div className={styles.orders} onClick={() => closeMenu()}>

                        <div className={styles.orderItem}>
                            <Link href='/orders'>
                                Orders &nbsp;
                            </Link>
                        </div>
                        <div>
                            <Link href='/orders'>
                                <img src='img/shoppingBag.svg' alt="order"/>
                            </Link>        
                        </div>
                    </div>
                </div>
            )}
            <div onClick={() => setShowDropdown(!showDropdown)}>
                <img src={`img/userProfile.svg`} alt="userProfile" width={30} height={30} />
            </div>
      
        </div>
        
    
    )
}

export default UserMenu