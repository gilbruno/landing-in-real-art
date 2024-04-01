import Link from "next/link";
import { useAppContext } from "../../../context";
import { Lang } from "../../../types/types";
import styles from "./HeroSectionMobile.module.scss";
import ImageHeroSectionMobile from "./ImageHeroSectionMobile";
import useSharedLogicHeroSection from "./useSharedLogicHeroSection";
import classNames from "classnames";

export interface HeroSectionMobileProps {
  className?: string;
}

const HeroSectionMobile = ({
  className,
  ...props
}: HeroSectionMobileProps): JSX.Element => {
  //Get the language of the global context
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  const FIREBASE_PRESALE_HERO_SECTION_SEE_DROP = "seeDrop";
  const FIREBASE_PRESALE_HERO_SECTION_SEE_DROP_LINK = "seeDropLink";

  const { presaleButtons, setPresaleButtons, presaleTexts, setPresaleTexts } =
    useSharedLogicHeroSection();

  return (
    <div className={styles["container"] + " " + className}>
      <div className={styles["title"]}>
        <div className={styles["container__heading"]}>
          <span>
            <span className={styles["heading-span"]}>
              {presaleTexts.title1[lang_]}
              <br />
            </span>
            <span className={styles["heading-span2"]}>
              {presaleTexts.title2[lang_]}
            </span>
          </span>
        </div>
        <img
          className={classNames(styles["container__rectangle"], {
            [styles["container__rectangle--bottom"]]: lang_ === "EN",
          })}
          src="img/eye-herosection-mobile.png"
        />
      </div>

      <div className={styles["containerImageHeroSectionMobile"]}>
        <ImageHeroSectionMobile />
      </div>

      <div className={styles["container__container-button"]}>
        <Link
          href={presaleButtons[FIREBASE_PRESALE_HERO_SECTION_SEE_DROP_LINK]}
        >
          <div className={styles["container__button"]}>
            <div className={styles["container__voir-le-drop"]}>
              {presaleButtons[FIREBASE_PRESALE_HERO_SECTION_SEE_DROP][lang_]}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HeroSectionMobile;
