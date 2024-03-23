"use client"
import VuesaxLinearStatusUp1 from "../../VuesaxLinearStatusUp1"
import { useAppContext } from "../../../context"
import { Lang } from "../../../types/types"
import parse from 'html-react-parser'
import styles from './PresalePros.module.scss'
import useSharedLogixPresalePros from "./useSharedLogixPresalePros"
import { FaGift } from 'react-icons/fa';
import { BsFillBookmarkPlusFill } from "react-icons/bs";

function PresalePros() {

    const {lang} = useAppContext()
    const lang_ = lang as Lang
    
    const {presaleProsTexts, setPresaleProsTexts, presaleProsButtons, setPresaleProsButtons} = useSharedLogixPresalePros()
    
    return (
        <div className={styles["frame-presalePros"]}>
        <div className={styles["frame-wrapper"]}>
            <div className={styles["frame-14"]}>
            <div className={styles["avantages-d-achats"]}>
                {parse(presaleProsTexts.mainTitle[lang_])}
            </div>
            <p className={styles["ne-louper-pas-la"]}>
                {parse(presaleProsTexts.mainDescription[lang_])}
            </p>
            </div>
        </div>
        <div className={styles["frame-presalePros-cards"]}>
            <div className={styles["frame-presalePros-card"]}>
            <div className={styles["frame-17"]}>
                <div className={styles["rectangle-4"]} />
                <VuesaxLinearStatusUp1 className={styles["vuesax-linear-status"]} />
            </div>
            <div className={styles["frame-18"]}>
                <div className={styles["heading-2"]}>{parse(presaleProsTexts.buyArtWorkTitle[lang_])}</div>
                <p className={styles["paragraph"]}>{parse(presaleProsTexts.buyArtWorkDescription[lang_])}</p>
            </div>
            {/* <div className={styles["heading-wrapper"]} onClick={() => {showModal(presaleProsTexts.buyArtWorkDetail[lang_])}}>
                <div className={styles["heading-3"]} >
                    {presaleProsButtons.buyArtWork[lang_]}
                </div>
            </div> */}
            </div>
            <div className={styles["frame-presalePros-centerCard"]}>
            <div className={styles["frame-3"]}>
                <div className={styles["frame-presalePros-card"]}>
                <div className={styles["frame-17"]}>
                    <div className={styles["rectangle-4"]} />
                    <BsFillBookmarkPlusFill className={styles["vuesax-linear-status"]} />
                </div>
                <div className={styles["frame-18"]}>
                    <div className={styles["heading-2"]}>{parse(presaleProsTexts.exclusiveBenefitsTitle[lang_])}</div>
                    <p className={styles["paragraph"]}>{parse(presaleProsTexts.exclusiveBenefitsDescription[lang_])}</p>
                </div>
                {/* <div className={styles["heading-wrapper"]} onClick={() => {showModal(presaleProsTexts.exclusiveBenefitsDetail[lang_])}}>
                    <div className={styles["heading-3"]}>{presaleProsButtons.exclusiveBenefits[lang_]}</div>
                </div> */}
                </div>
            </div>
            </div>
            <div className={styles["frame-presalePros-card"]}>
            <div className={styles["frame-17"]}>
                <div className={styles["rectangle-4"]} />
                <FaGift className={styles["vuesax-linear-status"]} />
            </div>
            <div className={styles["frame-18"]}>
                <div className={styles["heading-2"]}>{parse(presaleProsTexts.bonusTitle[lang_])}</div>
                <p className={styles["paragraph"]}>{parse(presaleProsTexts.bonusDescription[lang_])}</p>
            </div>
            {/* <div className={styles["heading-wrapper"]} onClick={() => {showModal(presaleProsTexts.bonusDetail[lang_])}}>
                <div className={styles["heading-3"]}>{presaleProsButtons.bonus[lang_]}</div>
            </div> */}
            </div>
        </div>

        </div>

    )
}

export default PresalePros