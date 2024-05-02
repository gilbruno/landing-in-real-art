"use client"
import { OrdersProps } from '../../types/types'
import styles from './Orders.module.scss'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useReadContract } from "wagmi"
import { Account } from '../web3/Account'
import { Lang, ResourceNftStatus, presaleArtworkOrder } from '@prisma/client'
import { useAppContext } from '../../context'
import { useEffect, useState } from 'react'
import { fetchOrders, fetchOrdersByOwner } from '../../lib/presaleArtworkOrder'
import OrderCard from './OrderCard'
import { orderPhygitalArtAddress } from '@/web3/constants'
import { OrderPhygitalArtAbi } from '@/web3/abi/OrderPhygitalArtAbi'
import { Address } from 'viem'



const Orders = ({texts, buttons}: OrdersProps): React.ReactNode => { 
    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang
    
    const { isConnected, address } = useAccount()

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
        lang: Lang.EN,
        contractAddress: '',
        created_at: new Date()
      }
    const [orders, setOrders] = useState<Array<presaleArtworkOrder>>([defaultOrder])

    const dataOwner = useReadContract({
        address: orderPhygitalArtAddress,
        abi: OrderPhygitalArtAbi,
        functionName: 'owner',
        args: [],
      })
    
    const [smartContractOwner, setSmartContractOwner] = useState<string>('')  
    const [isOwner, setIsOwner] = useState<boolean>(false)  

    console.log(dataOwner.data)
      
    useEffect(() => {
        if (dataOwner.isSuccess) {
            let smartContractOwner = dataOwner.data as string
            smartContractOwner = smartContractOwner.toLowerCase()
            setSmartContractOwner(smartContractOwner)
            const fethData = async (address : `0x${string}` | undefined, smartContractOwner: string) => {
                console.log('SC OWNER : ', smartContractOwner.toLowerCase())
                console.log('BUYER : ', address?.toLowerCase())
                let orders
                if (address?.toLowerCase() == smartContractOwner.toLowerCase()) {
                    orders = await fetchOrders()
                    setIsOwner(true)
                }
                else {
                    orders = await fetchOrdersByOwner(address)
                    setIsOwner(false)
                }
                setOrders(orders)
            }
            fethData(address, smartContractOwner)
    
        }
        
    }, [dataOwner.isSuccess, address])
    
    
    //------------------------------------------------------------------------------ handleOrder
    const handleOrder = async () => {
        if (isOwner) {
            console.log('REFUND !') 
        }
        else {
            console.log('CANCEL !') 
        }
        
    }
    
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
                    {(isConnected && isOwner) && orders.map((order, index) => (
                        <OrderCard key={index} buttons={buttons.refundBuyer[lang_]} texts={texts} order={order} buyer={address} handleOrder={handleOrder}/>
                    ))}
                    {(isConnected && !isOwner) && orders.map((order, index) => (
                        <OrderCard key={index} buttons={buttons.cancelOrder[lang_]} texts={texts} order={order} buyer={address} handleOrder={handleOrder}/>
                    ))}
                </div>

            </div>
        </>
    )
}

export default Orders