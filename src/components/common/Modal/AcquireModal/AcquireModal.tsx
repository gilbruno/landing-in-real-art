import { AcquireModalProps, Lang } from "@/types/types";
import {
  Card,
  CardBody,
  Divider,
  Heading,
  Stack,
  Text,
  Image,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton
} from "@chakra-ui/react";
import { IoSend } from "react-icons/io5";
import { useAppContext } from "@/context";
import Offers from "./Offers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import AcquireForm from "./AcquireForm";
import styles from "./AcquireModal.module.scss";


const AcquireModal = (props: AcquireModalProps) => {
  //Get the language of the global context
  const {lang} = useAppContext()
  const lang_ = lang as Lang
  
  const _chain = process.env.NEXT_PUBLIC_CHAIN
  const _chainId = process.env.NEXT_PUBLIC_CHAIN_ID

  const {
    showModal,
    setShowModal,
    artistName,
    name,
    size,
    imagePath,
    imageUrl,
    price,
    price2,
    price3,
    msgSuccessEmail,
    msgErrorEmail,
    titleFormEmail,
    offers,
    investmentTexts,
    formPresaleDelivery
  } = props;

  const art = {artistName: artistName, artworkName: name}
  const { isConnected, address, chain, chainId } = useAccount();
  
  const offerPrices = {price, price2, price3}

  return (
    <Modal
      scrollBehavior="inside"
      size="lg"
      isOpen={showModal}
      onClose={() => setShowModal(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton size="3xl"  zIndex="12"/>
        <ModalBody padding="20px">
            <Card size="lg">
              <CardBody>
                <Image src={imageUrl} alt="" borderRadius="lg" />
                <Stack mt="6" spacing="3">
                  <Heading size="md">
                    <b>{name}</b>
                  </Heading>
                  <Text>{size}</Text>
                  <Offers price={price} price2={price2} price3={price3} offers={offers} investmentTexts={investmentTexts}/>
                </Stack>
              </CardBody>
              <Divider />
              {!isConnected &&
                <div className={styles.connectWalletContainer}>
                  <div className={styles.connectWalletMsg}>{formPresaleDelivery.connectWalletMsg[lang_]}</div>
                  <div className={styles.connectWallet}><ConnectButton label={formPresaleDelivery.connectWallet[lang_]}/></div>
                </div> 
              } 

              {isConnected && (chainId != _chainId) &&
                <div className={styles.wrongNetwork}>
                  <div className={styles.connectWalletMsg}>{formPresaleDelivery.wrongNetwork[lang_]} {_chain}</div>
                </div> 
              }

              {isConnected && (chainId == _chainId) && 
                <AcquireForm art={art} formPresaleDelivery={formPresaleDelivery} offers={offers} offerPrices={offerPrices} web3Address={address}/>}
            </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AcquireModal;
