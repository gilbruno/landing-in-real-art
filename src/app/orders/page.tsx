"use client";
import styles from "./OrdersPage.module.scss";
import { useAppContext } from "../../context";
import { Lang } from "../../types/types";
import useSharedLogic from "../useSharedLogic";
import Footer from "../../components/footer/Footer";
import FooterMobile from "../../components/footer/FooterMobile";
import SimpleHeroSection from "../../components/heroSection/SimpleHeroSection";
import Orders from "../../components/orders/Orders";
import useSharedLogicOrders from "../../components/orders/useSharedLogicOrders";

export default function OrdersPage() {
  //Get the language of the global context
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  const { isMobile, setIsMobile } = useSharedLogic(800);

  const FIREBASE_ORDERS_PAGE_COLLECTION = 'Orders'
  const { texts, setTexts, buttons, setButtons } = useSharedLogicOrders(FIREBASE_ORDERS_PAGE_COLLECTION)
  
  const mainTitle = texts.mainTitle[lang_]
  
  return (
    <div
      id="home"
      className={styles["home"]}
      style={isMobile ? { paddingTop: "0px" } : { paddingTop: "" }}
    >
      {isMobile ? (
        <>
          <SimpleHeroSection mainTitle={mainTitle} />
          <Orders texts={texts} buttons={buttons}/>
          <FooterMobile />
        </>
      ) : (
        <>
          <SimpleHeroSection mainTitle={mainTitle} />
          <Orders texts={texts} buttons={buttons}/>
          <Footer />
        </>
      )}
    </div>
  );
}
