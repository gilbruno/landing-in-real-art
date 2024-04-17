import { useEffect, useRef, useState } from "react";
import styles from "./UserMenu.module.scss"
import Link from "next/link";
import useClickAway from "../../hooks/useClickAway";

export interface UserMenuProps {
    isClosed: boolean
  }

  
const UserMenu = (props: UserMenuProps) => {
    const { isClosed } = props
    const [showDropdown, setShowDropdown] = useState(false);
    // create a React ref for the dropdown element
    const dropdown = useRef(null);
    
    //Close menu if click anywhere else
    const alertClickAway = () => {
        closeMenu()
    }
    
    useClickAway(dropdown, alertClickAway);
      
    const closeMenu = () => {
      setShowDropdown(false)
    }
  
    return (
        <div className={styles.userMenuSelector}>
            <div onClick={() => setShowDropdown(b => !b)}>
                <img src={`img/userProfile.svg`} alt="userProfile" width={30} height={30} />
            </div>
            {showDropdown && (
                <div className={styles.dropdown} ref={dropdown}>
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
            
      
        </div>
        
    
    )
}

export default UserMenu