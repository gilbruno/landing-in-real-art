"use client";
import { Lang, OrdersButtons, OrdersTexts, PresaleDropPanelButtons, PresaleDropPanelTexts } from "@/types/types";
import styles from "./Orders.module.scss";
import { useAppContext } from "@/context";
import classNames from "classnames";
import { presaleArtworkOrder } from "@prisma/client";

interface OrderCardProps {
  order: presaleArtworkOrder;
  buttons: OrdersButtons
  texts: OrdersTexts
}
const OrderCard = ({ order, buttons, texts }: OrderCardProps) => {
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  return (
    <section className={classNames(styles["image-container"])}>
      <div className={styles.frameDetailArtWorkCreator}>
        <div className={styles.frameDetailOrderName}>{texts.orderCard.order[lang_]} #{order.tokenId}</div>
      </div>
      <div>
        <img alt="Order" src="/img/logo-IRA.png" />
      </div>
      <div className={classNames(styles["img-frame"])}>
        <div>{texts.orderCard.tokenID[lang_]} : {order.tokenId}</div>
        <div>{texts.orderCard.artistName[lang_]} :{order.artistName}</div>
        <div>{texts.orderCard.artworkName[lang_]} :{order.artworkName}</div>
        <div>{texts.orderCard.collectionName[lang_]} :{order.collectionName}</div>
        <div>{texts.orderCard.collectionSymbol[lang_]} :{order.collectionSymbol}</div>
        <div>{texts.orderCard.price[lang_]} : {order.price}$</div>
      </div>

      <button
        className={styles.buttonCancelOrder}>
        <div className={styles.textButtonCancelOrder}>
          {buttons.cancelOrder[lang_]}
        </div>
      </button>
      
    </section>
  );
};

export default OrderCard;
