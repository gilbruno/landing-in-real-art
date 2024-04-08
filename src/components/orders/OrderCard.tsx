"use client";
import { Lang, OrdersButtons, OrdersTexts, PresaleDropPanelButtons, PresaleDropPanelTexts } from "@/types/types";
import styles from "../presale/DropPanel/DropPanel.module.scss";
import { useAppContext } from "@/context";
import classNames from "classnames";
import { presaleArtworkOrder } from "@prisma/client";
import { ReactNode } from "react";
import OrderCardData from "./OrderCardDataServer";

interface OrderCardProps {
  order: presaleArtworkOrder;
  buttons: OrdersButtons
  texts: OrdersTexts,
  children: ReactNode
}
const OrderCard = ({ order, buttons, texts, children }: OrderCardProps) => {
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  return (
    <section className={classNames(styles["image-container"])}>
      <div className={styles.frameDetailArtWorkCreator}>
        <div></div>
        <div className={styles.frameDetailArtWorkCreatorName}>{order.artistName}</div>
      </div>

      <div className={classNames(styles["img-frame"])}>
        <img className={classNames(styles["img-main"])} src='' />
      </div>

      <div
        className={styles["img-overlay"]}
        style={{
          backgroundImage: `url('')`,
        }}
      />

      <OrderCardData/>
      <button
        className={styles["button-2"]}>
        <div className={styles["textButtonAcquire"]}>
          {buttons.cancelOrder[lang_]}
        </div>
      </button>
      
    </section>
  );
};

export default OrderCard;
