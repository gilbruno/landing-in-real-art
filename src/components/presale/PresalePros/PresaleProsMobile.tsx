import { useAppContext } from "../../../context";
import { Lang } from "../../../types/types";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./PresaleProsMobile.module.scss";
import parse from "html-react-parser";
import useSharedLogixPresalePros from "./useSharedLogixPresalePros";
import Link from "next/link";
import { Carousel } from "react-bootstrap";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";


const PresaleProsMobile = () => {
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  const {
    presaleProsTexts,
    setPresaleProsTexts,
    presaleProsButtons,
    setPresaleProsButtons,
  } = useSharedLogixPresalePros();

  return (
    <div className={styles["frame-48095815"]}>
      <div className={styles["frame-48095815__frame-36563"]}>
        <div className={styles["presaleProsMainTitle"]}>
          {parse(presaleProsTexts.mainTitle[lang_])}
        </div>
        <div className={styles["presaleProsMainDesc"]}>
          {parse(presaleProsTexts.mainDescription[lang_])}
        </div>
      </div>
      <div className={styles["frame-48095815__frame-48095814"]}>
        <div className={styles["frame-48095815__slider"]}>
          <Carousel
            indicators={false}
            touch={true}
            interval={null}
            prevIcon={<FaArrowCircleLeft className={styles["slider__prev"]} />}
            nextIcon={<FaArrowCircleRight className={styles["slider__next"]} />}
          >
            <Carousel.Item>
              <div className={styles["frame-48095815__frame-48095732"]}>
                <div className={styles["frame-48095815__frame-7"]}>
                  <div className={styles["frame-48095815__heading"]}>
                    {parse(presaleProsTexts.buyArtWorkTitle[lang_])}
                  </div>
                  <div className={styles["frame-48095815__paragraph"]}>
                    {parse(presaleProsTexts.buyArtWorkDescription[lang_])}
                  </div>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={styles["frame-48095815__frame-48095732"]}>
                <div className={styles["frame-48095815__frame-7"]}>
                  <div className={styles["frame-48095815__heading"]}>
                    {parse(presaleProsTexts.exclusiveBenefitsTitle[lang_])}
                  </div>
                  <div className={styles["frame-48095815__paragraph"]}>
                    {parse(
                      presaleProsTexts.exclusiveBenefitsDescription[lang_]
                    )}
                  </div>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className={styles["frame-48095815__frame-48095732"]}>
                <div className={styles["frame-48095815__frame-7"]}>
                  <div className={styles["frame-48095815__heading"]}>
                    {parse(presaleProsTexts.bonusTitle[lang_])}
                  </div>
                  <div className={styles["frame-48095815__paragraph"]}>
                    {parse(presaleProsTexts.bonusDescription[lang_])}
                  </div>
                </div>
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default PresaleProsMobile;
