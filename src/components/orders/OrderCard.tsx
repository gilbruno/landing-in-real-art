"use client";
import { Lang, OrdersButtons, OrdersTexts, PresaleDropPanelButtons, PresaleDropPanelTexts } from "@/types/types";
import styles from "./Orders.module.scss";
import { useAppContext } from "@/context";
import classNames from "classnames";
import { presaleArtworkOrder } from "@prisma/client";
import { Keccac256_ArtworkBuyingCancelled_Event, orderPhygitalArtAddress } from "@/web3/constants";
import { OrderPhygitalArtAbi } from "@/web3/abi/OrderPhygitalArtAbi";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect, useState } from "react";
import { Address } from "viem";
import Link from "next/link";
import parse from "html-react-parser"
import { FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { createRefundPresale, fetchRefundPresaleByTokenId } from "@/lib/presaleArtworkOrder";

interface OrderCardProps {
  order: presaleArtworkOrder
  buyer: Address | undefined
  buttons: string
  texts: OrdersTexts
  isOwner: boolean
}
const OrderCard = ({ order, buyer, buttons, texts, isOwner }: OrderCardProps) => {
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  const [txFees, setTxFees] = useState<string>('')
  const [isOrderRefundable, setIsOrderRefundable] = useState<boolean>(false)

  const toast = useToast()
  
  const {
    data: hash,
    isPending,
    writeContract,
    status,
    error,
    isError: writeContractError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
    error: transactionError,
    data: transactionData,
  } = useWaitForTransactionReceipt({ hash })

      //------------------------------------------------------------------- useEffect "transactionData"
      useEffect(
        () => {
            const parseLogs = async () => {
                const eventLogs = transactionData?.logs
                let txHash
                if (eventLogs) {
                        console.dir('EVENT LOGS : ', eventLogs)
                        let tokenIdHex = undefined
                        let tokenId = undefined
                        let maxCancelDateHex = undefined
                        let maxCancelDate = 0
                        for (let i = 0; i < eventLogs.length; i++) {
                            const eventLog = eventLogs[i]
                            console.log("EVENT LOG : ", eventLog)
                            txHash = eventLog.transactionHash
                            const topics = eventLog.topics
                            //If event is emitted, the Tx worked. We can create a record in the refundPresale table
                            if (topics[0]?.toLowerCase() == Keccac256_ArtworkBuyingCancelled_Event.toLowerCase()) {
                              console.log('')
                              const tokenId_ = order.tokenId as number
                              const buyer_ = buyer as string
                              const data = {
                                tokenId: tokenId_,
                                buyer: buyer_,
                                price: order.price,
                                contractAddress: orderPhygitalArtAddress
                              }
                              const refundPresale = await createRefundPresale(data)
                              console.log('RefundPresale created !!')
                            }
                                   
                        }
                    }
                
                // setMintingNft(false)
            }
            if (isConfirmed && transactionData !== undefined) {
                parseLogs()
            }
            
        }, [isConfirmed]
    )


    //-------------------------------------------------------------------------- handleChangeTxFees
    const handleChangeTxFees = (e: any) => setTxFees(e.target.value)

    //------------------------------------------------------------------------------ displayInfo
    const displayInfo = (msgInfo: string, nbSeconds: number) => {
      toast({
          title: parse(msgInfo),
          description: "",
          status: "info",
          duration: nbSeconds * 1000,
          isClosable: true,
      })
  }

    //------------------------------------------------------------------------------ displayError
    const displayError = (msgInfo: string, nbSeconds: number) => {
      toast({
          title: parse(msgInfo),
          description: "",
          status: "error",
          duration: nbSeconds * 1000,
          isClosable: true,
      })
    }

    //------------------------------------------------------------------------------ handleOrder
    const handleOrder = async (e: any) => {
      //Refund if the buyer is connected to the Dapp
      if (isOwner) {
          const currentDate = new Date()
          console.log('current date ', currentDate) 
          console.log('max Cancel date ', order.maxCancelDate)
          
          if (currentDate < order.maxCancelDate) {
            writeContract({
              address: orderPhygitalArtAddress,
              abi: OrderPhygitalArtAbi,
              functionName: "cancelArtworkBuying",
              args: [order.tokenId]
          })

          }
          else {
            displayInfo('You can not cancel anymore', 4)
          }
          
          console.log('REFUND !') 
          console.log('Token ID ', order.tokenId)

      }
      //Refund if the owner is connected to the Dapp
      //Only if there's a record in the refundPresale that indicates that the buyer cancel his order with a tx SC
      else {
        const tokenId_ = order.tokenId as number
        const refundPresale = fetchRefundPresaleByTokenId(tokenId_, order.contractAddress)
        if (!refundPresale) {
          setIsOrderRefundable(false)
        }
        else {
          setIsOrderRefundable(true)
          if (txFees === '') {
            displayError('The Tx fees to refund is mandatory', 5)
            return
          }
          writeContract({
            address: orderPhygitalArtAddress,
            abi: OrderPhygitalArtAbi,
            functionName: "sendAmountBack",
            args: [order.tokenId, txFees]
          })
        }
          
      }
      
  }

  return (
    <section className={classNames(styles["image-container"])}>
      <div className={styles.frameDetailArtWorkCreator}>
        <div className={styles.frameDetailOrderName}>{texts.orderCard.order[lang_]} #{order.tokenId}</div>
      </div>
      <div>
        <img alt="Order" src="/img/logo-IRA.png" />
      </div>
      <div className={classNames(styles["img-frame"])}>
        <div><span className={styles.presaleOrderItem}>{texts.orderCard.tokenID[lang_]}</span> : {order.tokenId}</div>
        <div><span className={styles.presaleOrderItem}>{texts.orderCard.artistName[lang_]}</span> : {order.artistName}</div>
        <div><span className={styles.presaleOrderItem}>{texts.orderCard.artworkName[lang_]}</span> : {order.artworkName}</div>
        <div><span className={styles.presaleOrderItem}>{texts.orderCard.maxCancelDate[lang_]}</span> : {order.maxCancelDate.toDateString()}</div>
        <div><span className={styles.presaleOrderItem}>{texts.orderCard.imageLink[lang_]}</span> : <Link href={order.gatewayImageUri}>{order.gatewayImageUri}</Link></div>
        <div><span className={styles.presaleOrderItem}>{texts.orderCard.price[lang_]}</span> : {order.price}$</div>

        {
          isOwner && 
          <FormControl color={"white"} isInvalid={false}>
              <FormLabel color={"blue"}>
                <span>TX Fees in ETH (Tx Hash : {order.txHash})</span>
              </FormLabel>
              <Input
                value={txFees}
                isRequired={true}
                color={"black"}
                backgroundColor={"white"}
                placeholder={""}
                focusBorderColor="white"
                onChange={handleChangeTxFees}
              />
          </FormControl>
        }
        

      </div>

      {
        ((isOwner && isOrderRefundable) || !isOwner) && 
            <button onClick={handleOrder}
            className={styles.buttonCancelOrder}>
            <div className={styles.textButtonCancelOrder}>
              {buttons}
            </div>
          </button>
      }

    </section>
  );
};

export default OrderCard;
