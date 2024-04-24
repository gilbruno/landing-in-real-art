"use client"
import { OrdersProps } from '../../types/types'
import styles from './Orders.module.scss'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Account } from '../web3/Account';
import { Lang, ResourceNftStatus, presaleArtworkOrder } from '@prisma/client';
import { useAppContext } from '../../context';
import { useEffect, useState } from 'react';
import { fetchOrdersByOwner } from '../../lib/presaleArtworkOrder';
import OrderCard from './OrderCard';



const Orders = ({texts, buttons}: OrdersProps): React.ReactNode => { 
    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang
    
    const { isConnected, address } = useAccount();
    const defaultOrder = {
        id: 0,
        artistName: '', 
        artworkName: '', 
        hashArt: '',
        tokenId: 0,
        txHash: '',
        owner: '',
        collectionName: '',
        collectionSymbol: '',
        price: 0,
        offerNumber: 0,
        status: ResourceNftStatus.UPLOADIPFS,
        imageUri: '',
        gatewayImageUri: '',
        metadataUri: '',
        gatewayMetadataUri: '', 
        lang: Lang.EN
      }
    const [orders, setOrders] = useState<Array<presaleArtworkOrder>>([defaultOrder])

    useEffect(() => {
        const fethData = async (address : `0x${string}` | undefined) => {
            const orders = await fetchOrdersByOwner(address)
            setOrders(orders)
        }
        fethData(address)
    }, [address]);

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
                    {!isConnected && <ConnectButton/>}
                    </div>
                </div>
                <div className={styles["image-grid"]}>
                    {isConnected && orders.map((order, index) => (
                        <OrderCard key={index} buttons={buttons} texts={texts} order={order}/>
                    ))}
                </div>

            </div>
        </>
    )
}

export default Orders