import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore/lite";
import {
  EndDateTimestamp,
  PresaleArtWorks,
  PresaleDropPanelButtons,
  PresaleDropPanelData,
  PresaleDropPanelTexts,
  defaultLangObject,
} from "../../../types/types";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

const useSharedLogicDropPanel = () => {
  const FIREBASE_DROPPANEL_COLLECTION = "Presale_DropPanel";

  const defaultText = {
    endDrop: defaultLangObject,
    countDown: {
      endDate: {
        nanoseconds: 0,
        seconds: 0,
      },
    },
    msgErrorEmail: defaultLangObject,
    msgSuccessEmail: defaultLangObject,
    titleFormEmail: defaultLangObject,
  };

  const defaultButton = {
    acquireArtWork: defaultLangObject,
    seeMoreImages: defaultLangObject,
    buyArtworkNow: defaultLangObject,
    closeArtworkDetail: defaultLangObject,
    detailArtWork: defaultLangObject,
    viewMoreArtworks: defaultLangObject,
  };

  const defaultArtwork = {
    artistName: "",
    description: defaultLangObject,
    image: "",
    image2: "",
    url: "",
    url2: "",
    price: 0,
    size: defaultLangObject,
    name: defaultLangObject,
    order: 0,
    mockups: [],
    noBorder: false
  };
  const [isLoading, setIsLoading] = useState(true);
  const [artWorks, setArtWorks] = useState<PresaleArtWorks>([]);
  const [buttons, setButtons] =
    useState<PresaleDropPanelButtons>(defaultButton);
  const [texts, setTexts] = useState<PresaleDropPanelTexts>(defaultText);
  const [showDesign, setShowDesign] = useState<number | null>(1);

  async function getUrlPhoto(photo: string): Promise<string> {
    if (photo === "") {
      return "";
    }

    let imageRef: any = null;
    try {
      imageRef = ref(storage, photo);
      const urlPhoto = await getDownloadURL(imageRef);
      return urlPhoto;
    } catch (error) {
      return "";
    }
  }

  async function transformArtworksPhotos(
    artworks: PresaleArtWorks
  ): Promise<PresaleArtWorks> {
    const promises = artworks.map(async (artwork) => {
      return {
        ...artwork,
        url: await getUrlPhoto(artwork.image),
        url2: await getUrlPhoto(artwork.image2),
        mockups:
          artwork.mockups?.length > 0
            ? await Promise.all(
                artwork.mockups.map(async (art) => await getUrlPhoto(art))
              )
            : [],
      };
    });

    return Promise.all(promises);
  }

  useEffect(() => {
    const fetchData = async () => {
      const collection_ = collection(db, FIREBASE_DROPPANEL_COLLECTION);
      const documents = await getDocs(collection_);
      const data = documents.docs.map(
        (doc) => doc.data() as PresaleDropPanelData
      );

      //Index 0 ===> ArtWorks
      const artworks_ = data[0]["artworks"]
        .sort((a, b) => a.order - b.order)
        .filter((artwork) => !artwork.desactivate) as PresaleArtWorks;
      const artworks_tmp = await transformArtworksPhotos(artworks_);
      setArtWorks(artworks_tmp);
      //Index 1 ===> Buttons
      setButtons(data[1]);
      //Index 2 ===> Texts
      setTexts(data[2]);
      setIsLoading(false);
    };

    fetchData();
    setShowDesign(0);
  }, []);

  return {
    loading: isLoading,
    artWorks,
    buttons,
    texts,
    showDesign,
    setShowDesign,
  };
};

export default useSharedLogicDropPanel;
