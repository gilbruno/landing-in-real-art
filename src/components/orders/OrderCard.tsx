"use client";
import { Lang, OrdersButtons, OrdersTexts, PresaleDropPanelButtons, PresaleDropPanelTexts } from "@/types/types";
import styles from "./Orders.module.scss";
import { useAppContext } from "@/context";
import classNames from "classnames";
import { presaleArtworkOrder } from "@prisma/client";
import { orderPhygitalArtAddress } from "@/web3/constants";
import { OrderPhygitalArtAbi } from "@/web3/abi/OrderPhygitalArtAbi";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { Address } from "viem";

interface OrderCardProps {
  order: presaleArtworkOrder
  buyer: Address | undefined
  buttons: string
  texts: OrdersTexts
  handleOrder: any
}
const OrderCard = ({ order, buyer, buttons, texts, handleOrder }: OrderCardProps) => {
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  useEffect(() => {

      
  }, [])

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
        <div><span className={styles.presaleOrderItem}>{texts.orderCard.collectionName[lang_]}</span> : {order.collectionName}</div>
        <div><span className={styles.presaleOrderItem}>{texts.orderCard.collectionSymbol[lang_]}</span> : {order.collectionSymbol}</div>
        <div><span className={styles.presaleOrderItem}>{texts.orderCard.price[lang_]}</span> : {order.price}$</div>
      </div>

      <button onClick={handleOrder}
        className={styles.buttonCancelOrder}>
        <div className={styles.textButtonCancelOrder}>
          {buttons}
        </div>
      </button>
      
    </section>
  );
};

export default OrderCard;
