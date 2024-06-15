import React, { useEffect, useState } from "react";
import ImageHeroSection from "./ImageHeroSection";
import styles from "./HeroSection.module.scss";
import Link from "next/link";
import { HeaderButtons, HeaderTexts, Lang } from "../../../types/types";
import { useAppContext } from "../../../context";
import RegistrationTestnet from "./RegistrationTestnet";

export interface HeroSectionTestnetProps {
  headerTexts: HeaderTexts;
  headerButtons: HeaderButtons;
  onlyFirstButton: boolean;
}

const HeroSection = ({
  headerTexts,
  headerButtons,
  onlyFirstButton,
  ...props
}: HeroSectionTestnetProps) => {
  //Get the language of the global context
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  const [modalTestnetRegistration, setModalTestnetRegistration] = useState<boolean>(false)

  useEffect(
    () => {
      
    }, [modalTestnetRegistration]
  )

  return (
    <div className={styles["heroSectionTestnetContainer"]}>
      <ImageHeroSection />

      <div className={styles["heroSectionTestnetTexts"]}>
        <div className={styles["buttonJoinTestnetContainer"]}>
          <div className={styles["buttonJoinTestnet"]} onClick={() => setModalTestnetRegistration(true)}>
            {headerButtons.button1[lang_]}
          </div>
        </div>
        <div className={styles["heroSectionTestnetTextsBottom"]}>
          <div className={styles["frame-48095766__heading"]}>
            <span>
              <span className={styles.headingSpan}>
                Whitelist
                <br />
              </span>
              <span className={styles.headingSpan2}>TestNet</span>
            </span>
          </div>
          <div className={styles["heroSectionTestnetTextsBottomRight"]}>
            {headerTexts.title2[lang_]}
          </div>
        </div>
      </div>
      <RegistrationTestnet
        title={headerTexts.registrationFormTitle[lang_]}
        description={headerTexts.registrationFormDescription[lang_]}
        showModal={modalTestnetRegistration}
        setShowModal={setModalTestnetRegistration}
      />

    </div>
  );
};

export default HeroSection;
