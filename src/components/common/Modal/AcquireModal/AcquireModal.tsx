import { useState } from "react";
import { AcquireModalProps, Lang } from "@/types/types";
import { validateEmail } from "@/utils/client/clientFunctions";
import { PRIVATESALE_TABLE } from "@/utils/supabase/constants";
import { insertEmail } from "@/utils/supabase/supabaseFunctions";
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  ButtonGroup,
  Button,
  Text,
  Image,
  FormControl,
  FormLabel,
  Input,
  useToast,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import parse from "html-react-parser";
import styles from "./AcquireModal.module.scss";
import { IoSend } from "react-icons/io5";
import useSharedLogicDropPanel from "@/components/presale/DropPanel/useSharedLogicDropPanel";
import { useAppContext } from "@/context";

const AcquireModal = (props: AcquireModalProps) => {
  const {
    showModal,
    setShowModal,
    name,
    size,
    imagePath,
    imageUrl,
    price,
    msgSuccessEmail,
    msgErrorEmail,
    titleFormEmail
  } = props;
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setEmailValid] = useState<boolean>(true);
  const toast = useToast();

  //------------------------------------------------------------------------------ handleChangeEmail
  const handleChangeEmail = (e: any) => setEmail(e.target.value);

  //------------------------------------------------------------------------------ handlSendEmail
  const handlSendEmail = async () => {
    if (validateEmail(email)) {
      setEmailValid(true);

      try {
        //Insert in collectionNfts Table
        const msgError = await insertEmail(PRIVATESALE_TABLE, email, imagePath);
        if (msgError !== "") {
          toast({
            title: msgError,
            description: "",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          // Popup a succes toast if no errors.
          toast({
            title: parse(msgSuccessEmail),
            description: "",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        throw error;
      }
    } else {
      setEmailValid(false);
      // Popup a succes toast if no errors.
      toast({
        title: parse(msgErrorEmail),
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
                  <Text color="blue.600" fontSize="2xl">
                    {price} €
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  {/*
                                      <Button variant='solid' colorScheme='blue'>
                                          {buttonBuyStripe}
                                      </Button>
                                  */}
                  <div className={styles.buttonPreBuyContainer}>
                    <div className={styles.messageNotConnected}>
                      {titleFormEmail}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                      }}
                    >
                      <FormControl color={"white"} isInvalid={false}>
                        <FormLabel color={"blue"}></FormLabel>
                        <Input
                          type="email"
                          color={"black"}
                          backgroundColor={"white"}
                          placeholder={""}
                          focusBorderColor="white"
                          onChange={handleChangeEmail}
                        />
                        {!isEmailValid && (
                          <FormErrorMessage>{msgErrorEmail}</FormErrorMessage>
                        )}
                      </FormControl>
                      <div className={styles.rectangleSendEmail}>
                        <Button
                          leftIcon={<IoSend />}
                          colorScheme="#465c79"
                          variant="solid"
                          left={"5px"}
                          onClick={handlSendEmail}
                        ></Button>
                      </div>
                    </div>
                  </div>
                </ButtonGroup>
              </CardFooter>
            </Card>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AcquireModal;
