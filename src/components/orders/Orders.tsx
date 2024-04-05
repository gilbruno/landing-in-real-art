"use client"
import { OrdersProps } from '../../types/types'
import styles from './Orders.module.scss'
import parse from 'html-react-parser'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Account } from '../web3/Account';


const Orders = ({mainTitle, web3Connection, ...props}: OrdersProps) => { 
    const { isConnected, address } = useAccount();
    return (
        <>
            <div className={styles.msgWeb3Container}>
                {isConnected && <Account/>}
                {!isConnected && 
                    (
                        <div>
                            <ConnectButton/>
                        </div>
                        
                    )
                }
            </div>
            <div>
            
            </div>
        </>
    )
}

export default Orders