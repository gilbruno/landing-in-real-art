"use client";
import { useAppContext } from "../../../context";
import { Lang } from "../../../types/types";
import Link from "next/link";
import styles from "./HeroSection.module.scss";
import useSharedLogicHeroSection from "./useSharedLogicHeroSection";

const HeroSection = () => {
  //Get the language of the global context
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  const FIREBASE_PRESALE_HERO_SECTION_SEE_DROP = "seeDrop";
  const FIREBASE_PRESALE_HERO_SECTION_SEE_DROP_LINK = "seeDropLink";

  const { presaleButtons, setPresaleButtons, presaleTexts, setPresaleTexts } =
    useSharedLogicHeroSection();

  return (
    <div className={styles["header-presale"]}>
      <div className={styles["frame-2"]}>
        <div className={styles["frame-3"]}>
          <p className={styles["heading"]}>
            <span className={styles["text-wrapper"]}>
              {" "}
              {presaleTexts.title1[lang_]}{" "}
            </span>
            <span className={styles["presale-header-title2"]}>
              {presaleTexts.title2[lang_]}
            </span>
          </p>
          <img
            className={styles["rectangle"]}
            alt=""
            style={{ width: "255px", marginLeft: "50px" }}
            src="https://cdn.animaapp.com/projects/655cacc35c6faf1eb176ebc4/releases/657325d4ed28baa6bd577524/img/rectangle-39772@2x.png"
          />
        </div>
        <div className={styles["frame-4"]}>
          <div className={styles["div-wrapper"]}>
            <p className={styles["p"]}>{presaleTexts.description[lang_]}</p>
          </div>
          <img
            className={styles["img"]}
            alt=""
            src="https://cdn.animaapp.com/projects/655cacc35c6faf1eb176ebc4/releases/657325d4ed28baa6bd577524/img/rectangle-39773.svg"
          />
          <Link
            href={presaleButtons[FIREBASE_PRESALE_HERO_SECTION_SEE_DROP_LINK]}
          >
            <div className={styles["button"]}>
              <div className={styles["text-wrapper-2"]}>
                {presaleButtons[FIREBASE_PRESALE_HERO_SECTION_SEE_DROP][lang_]}
              </div>
            </div>
          </Link>
        </div>
      </div>
      <img
        className={styles["mainImage"]}
        alt=""
        src="https://cdn.animaapp.com/projects/655cacc35c6faf1eb176ebc4/releases/657325d4ed28baa6bd577524/img/rectangle-39771.svg"
      />
    </div>
  );
};

export default HeroSection;
