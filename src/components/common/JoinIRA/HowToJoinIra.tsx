"use client";
import styles from "./HowToJoinIra.module.scss";
import { useAppContext } from "../../../context";
import { JoinIraDataButton, JoinIraDataText, Lang } from "../../../types/types";
import Link from "next/link";
import useSharedLogicHowToJoinIra from "./useSharedLogicHowToJoinIra";
import CardSlider from "@/components/home/CardSlider/CardSlider";
import Image from "next/image";
import classNames from "classnames";

export interface HowToJoinIraProps {
  joinIraDataText: JoinIraDataText;
  joinIraDataButton: JoinIraDataButton;
  onlyFirstButton: boolean;
  isTesnet?: boolean;
}

const HowToJoinIra = ({
  joinIraDataText,
  joinIraDataButton,
  onlyFirstButton,
  isTesnet,
  ...props
}: HowToJoinIraProps) => {
  //Get the language of the global context
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  return (
    <div
      className={classNames(styles["feature"], {
        [styles["feature--testnet"]]: isTesnet,
      })}
    >
      {isTesnet ? (
        <Image
          alt="Marketplace Mockup "
          src="/img/mockup.png"
          width={974}
          height={617}
          className={styles.img}
        />
      ) : (
        <CardSlider viewMoreText={joinIraDataButton.ViewMoreArtworks[lang_]} />
      )}
      <div className={styles.frame48095733}>
        <div className={styles.frame303}>
          <div className={styles.comment}>
            {joinIraDataText.headerText[lang_]}
          </div>
          <div className={styles.iraAmbition}>
            {joinIraDataText.text1[lang_]}
            <br />
            <br />
            {joinIraDataText.text2[lang_]}
          </div>
          <div className={styles.linkButton}>
            <div className={styles.button2}>
              <Link
                className={styles.joinIRALink}
                href={joinIraDataButton.JoinIRALink}
              >
                <div className={styles.rejoindreIra2}>
                  {joinIraDataButton.JoinIRA[lang_]}
                </div>
              </Link>
            </div>
            {joinIraDataButton.StartIRA && (
              <div className={styles.button3}>
                <Link
                  className={styles.startIRALink}
                  href={joinIraDataButton.StartIRALink[lang_]}
                >
                  <div className={styles.jeDemarre2}>
                    {joinIraDataButton.StartIRA[lang_]}
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToJoinIra;
