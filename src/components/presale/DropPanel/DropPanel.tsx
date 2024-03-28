"use client";
import { useState } from "react";
import { useAppContext } from "../../../context";
import { Lang } from "../../../types/types";
import styles from "./DropPanel.module.scss";
import useSharedLogicDropPanel from "./useSharedLogicDropPanel";
import { Spinner } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";

import ArtworkCard from "@/components/cards/ArtworkCard";

const DropPanel: React.FC = () => {
  //Get the language of the global context
  const { lang } = useAppContext();
  const lang_ = lang as Lang;

  const { artWorks, buttons, texts, loading } = useSharedLogicDropPanel();

  // State to keep track of how many images are currently displayed
  const [visibleCount, setVisibleCount] = useState(12);

  // Function to load more images
  const loadMoreArtworks = () => {
    setVisibleCount((prevCount) => prevCount + 12);
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
            {new Date("2024-04-10T12:00:00").toLocaleDateString() + ""}
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
        </div>
        {visibleCount < artWorks.length && (
          <button
            className={styles["button-seemore"]}
            style={{ cursor: "pointer" }}
            onClick={loadMoreArtworks}
          >
            <FaPlus />
            {buttons.viewMoreArtworks[lang_]}
          </button>
        )}
      </div>
    </>
  );
};

export default DropPanel;
