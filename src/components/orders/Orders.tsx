"use client"
import { Lang, OrdersProps } from '../../types/types'
import styles from './Orders.module.scss'
import parse from 'html-react-parser'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Account } from '../web3/Account';
import { presaleArtworkOrder } from '@prisma/client';
import OrderCard from './OrderCard';
import { useAppContext } from '../../context';
import OrderCardData from './OrderCardDataServer';
import OrderCardDataClient from './OrderCardDataClient';
import OrderCardDataServer from './OrderCardDataServer';


const Orders = ({texts, buttons, orders}: OrdersProps): React.ReactNode => { 
    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang
    
    const { isConnected, address } = useAccount();
    return (
        <>
            <div id="orderPanel" className={styles["grid-wrapper"]}>
                <div className={styles["header"]}>
                    <div className={styles["frame-7"]}>
                        <div className={styles["text-wrapper-3"]}>
                            {isConnected && texts.web3Connection.msgConnected[lang_]}
                            {!isConnected && texts.web3Connection.msgNotConnected[lang_]}
                        </div>
                    </div>
                    <div className={styles["text-wrapper-4"]}>
                    {isConnected && <Account/>}
                    {!isConnected && 
                        (
                            <div>
                                <ConnectButton/>
                            </div>
                        )
                    }
                    </div>
                </div>
                
                <div className={styles["image-grid"]}>
                    {isConnected && orders.map((order) => (
                            <div key={order.id}>
                                {order.artistName}||
                                {order.artworkName}
                            </div>
                        
                    ))}
                </div>
            </div>
        </>
    )
}

export default Orders