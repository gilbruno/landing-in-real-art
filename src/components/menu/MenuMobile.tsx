import React, { FC } from "react";
import styles from "./MenuMobile.module.scss";
import useSharedLogicMenu from "./useSharedLogicMenu";
import { useAppContext } from "../../context";
import Link from "next/link";
import { Lang } from "../../types/types";

export interface MenuMobileProps {
  isOpen: boolean;
  closeMenu: () => void;
}

const MenuMobile: FC<MenuMobileProps> = ({ isOpen, closeMenu }) => {
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  const {
    community,
    setCommunity,
    team,
    setTeam,
    about,
    setAbout,
    resources,
    setResources,
    communityLink,
    setCommunityLink,
    teamLink,
    setTeamLink,
    aboutLink,
    setAboutLink,
    resourcesLink,
    setResourcesLink,
    presale,
    setPresale,
    testnet,
    setTestnet,
  } = useSharedLogicMenu();

  return (
    <div
      id="navBarMenuMobile"
      className={styles.navBarMenuMobile}
    >
      <div className={styles.menuMobileItem}>
        <Link href={`/${communityLink}`} onClick={closeMenu}>
          {community[lang_]}
        </Link>
      </div>
      <div className={styles.menuMobileItem}>
        <Link href={`/${teamLink}`} onClick={closeMenu}>
          {team[lang_]}
        </Link>
      </div>
      <div className={styles.menuMobileItem}>
        <Link href={aboutLink} onClick={closeMenu}>
          {about[lang_]}
        </Link>
      </div>
      {/* <div className={styles.menuMobileItem}>
            
                <Link className={styles.menuLinkElement} href={resourcesLink} onClick={handleIsOpen}>
                    {resources[lang_]}
                </Link>
            
        </div> */}
      <div className={styles.wrapperButton}>
        <div className={styles.menuMobileButton}>
          <Link className={styles.linkPresale} href="/presale" onClick={closeMenu}>
            {presale[lang_]}
          </Link>
        </div>
        <div className={styles.menuMobileButton}>
          <Link className={styles.linkPresale} href="/testnet" onClick={closeMenu}>
            {testnet[lang_]}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MenuMobile;
