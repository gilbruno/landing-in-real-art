"use client";
import { useAppContext } from "../../../context";
import { Lang } from "../../../types/types";
import styles from "./DropPanel.module.scss";
import useSharedLogicDropPanel from "./useSharedLogicDropPanel";
import { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import ArtworkCard from "@/components/cards/ArtworkCard";

const DropPanel: React.FC = () => {
  //Get the language of the global context
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  const { artWorks, buttons, texts, loading } = useSharedLogicDropPanel();

  // State to keep track of how many images are currently displayed
  const [visibleCount, setVisibleCount] = useState(10);

  // Function to load more images
  const loadMoreArtworks = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  if (loading) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    );
  }

  return (
    <>
      <div id="dropPanel" className={styles["grid-wrapper"]}>
        <div className={styles["header"]}>
          <div className={styles["frame-7"]}>
            <div className={styles["text-wrapper-3"]}>
              {texts.endDrop[lang_]}
            </div>
          </div>
          <div className={styles["text-wrapper-4"]}>
            {new Date('2024-04-10T12:00:00').toLocaleDateString() + ""}
          </div>
        </div>
        <div className={styles["image-grid"]}>
          {artWorks.slice(0, visibleCount).map((artwork, index) => (
            <ArtworkCard
              id={index}
              key={index}
              artwork={artwork}
              buttons={buttons}
              texts={texts}
            />
          ))}

          {visibleCount < artWorks.length && (
            <button
              className={styles["button-2"]}
              style={{ cursor: "pointer" }}
              onClick={loadMoreArtworks}
            >
              {buttons.viewMoreArtworks[lang_]}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default DropPanel;
