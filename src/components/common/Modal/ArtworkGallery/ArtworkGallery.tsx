"use client";
import {
  CloseButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  defineStyle,
  defineStyleConfig,
} from "@chakra-ui/react";
import styles from "./ArtworkGallery.module.scss";
import cn from "classnames";

interface ArtworkGalleryProps {
  showModalImages: boolean;
  setShowModalImages: React.Dispatch<React.SetStateAction<boolean>>;
  artworks: string[];
}
const ArtworkGallery = ({
  artworks,
  showModalImages,
  setShowModalImages,
}: ArtworkGalleryProps) => {
  return (
    <Modal
      scrollBehavior="inside"
      size="full"
      isOpen={showModalImages}
      onClose={() => setShowModalImages(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton size="lg" color="#ffffff"/>
        <ModalBody padding="0px">
          <div className={styles["gallery"]}>
            {artworks.map((artwork, index) => (
              <figure
                key={artwork}
                className={cn(
                  styles["gallery__item"],
                  styles[`gallery__item--${index}`]
                )}
              >
                <img className={styles["gallery__img"]} src={artwork} />
              </figure>
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ArtworkGallery;
