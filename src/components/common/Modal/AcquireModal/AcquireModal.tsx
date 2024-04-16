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
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import parse from "html-react-parser";
import styles from "./AcquireModal.module.scss";
import { IoSend } from "react-icons/io5";
import { useAppContext } from "@/context";
import Offers from "./Offers";
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons'


const AcquireModal = (props: AcquireModalProps) => {
  //Get the language of the global context
  const {lang} = useAppContext()
  const lang_ = lang as Lang
  
  const {
    showModal,
    setShowModal,
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
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [fullAddress, setFullAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isEmailValid, setEmailValid] = useState<boolean>(true);
  const toast = useToast();
  const isFirstNameRequired    = firstName === ''
  const isLastNameRequired     = lastName === ''
  const isFullAddressRequired  = fullAddress === ''
  const isPhoneNumberRequired  = phoneNumber === ''

  //------------------------------------------------------------------------------ handleChangeEmail
  const handleChangeEmail = (e: any) => setEmail(e.target.value);

  //-------------------------------------------------------------------------- handleChangeFirstName
  const handleChangeFirstName = (e: any) => setFirstName(e.target.value);

  //-------------------------------------------------------------------------- handleChangeLastName
  const handleChangeLastName = (e: any) => setLastName(e.target.value);

  //------------------------------------------------------------------------ handleChangeFullAddress
  const handleChangeFullAddress = (e: any) => setFullAddress(e.target.value);

  //------------------------------------------------------------------------ handleChangePhoneNumber
  const handleChangePhoneNumber = (e: any) => setPhoneNumber(e.target.value);

  //------------------------------------------------------------------------------ handlSendEmail
  const handlSendEmail = async () => {
    let success = true
    if (validateEmail(email)) {
      setEmailValid(true);
      // Popup a succes toast if no errors.
      /*
      toast({
        title: parse(msgSuccessEmail),
        description: "",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      */
    } else {
      setEmailValid(false);
      success = false
      // Popup an error toast
      toast({
        title: parse(msgErrorEmail),
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    //First Name
    if (isFirstNameRequired){
      success = false
      // Popup an error toast
      toast({
        title: parse(formPresaleDelivery.msgErrorFirstName[lang_]),
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    //Last Name
    if (isLastNameRequired){
      success = false
      // Popup an error toast 
      toast({
        title: parse(formPresaleDelivery.msgErrorLastName[lang_]),
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    //Full Address
    if (isFullAddressRequired){
      success = false
      // Popup an error toast 
      toast({
        title: parse(formPresaleDelivery.msgErrorFullAddress[lang_]),
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    if (isPhoneNumberRequired){
      success = false
      // Popup an error toast 
      toast({
        title: parse(formPresaleDelivery.msgErrorPhoneNumber[lang_]),
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    if (success) {
      //Do something
    }
  }

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
              <CardFooter>
                <ButtonGroup spacing="2">
                  {/*
                                      <Button variant='solid' colorScheme='blue'>
                                          {buttonBuyStripe}
                                      </Button>
                                  */}
                  <div className={styles.buttonPreBuyContainer}>
                    <div className={styles.messageNotConnected}>
                      {formPresaleDelivery.mainTitle[lang_]}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "5px",
                      }}
                    >
                      <FormControl color={"white"} isInvalid={false}>
                        <FormLabel color={"blue"}>
                          <span className={styles.formPresaleLabel}>{formPresaleDelivery.email[lang_]}</span>
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents='none'>
                              <EmailIcon color='gray.300' />
                            </InputLeftElement>
                          <Input
                            type="email"
                            color={"black"}
                            backgroundColor={"white"}
                            placeholder={""}
                            focusBorderColor="white"
                            onChange={handleChangeEmail}
                          />
                        </InputGroup>
                        
                      </FormControl>
                      <FormControl color={"white"} isInvalid={false}>
                        <FormLabel color={"blue"}>
                          <span className={styles.formPresaleLabel}>{formPresaleDelivery.firstName[lang_]}</span>
                        </FormLabel>
                        <Input
                          value={firstName}
                          isRequired={true}
                          color={"black"}
                          backgroundColor={"white"}
                          placeholder={""}
                          focusBorderColor="white"
                          onChange={handleChangeFirstName}
                        />
                      </FormControl>
                      <FormControl color={"white"} isInvalid={false}>
                        <FormLabel color={"blue"}>
                          <span className={styles.formPresaleLabel}>{formPresaleDelivery.lastName[lang_]}</span>
                        </FormLabel>
                        <Input
                          value={lastName}
                          isRequired={true}
                          color={"black"}
                          backgroundColor={"white"}
                          placeholder={""}
                          focusBorderColor="white"
                          onChange={handleChangeLastName}
                        />
                      </FormControl>
                      <FormControl color={"white"} isInvalid={false}>
                        <FormLabel color={"blue"}>
                          <span className={styles.formPresaleLabel}>{formPresaleDelivery.fullAddress[lang_]}</span>
                        </FormLabel>
                        <Input
                          value={fullAddress}
                          isRequired={true}
                          color={"black"}
                          backgroundColor={"white"}
                          placeholder={""}
                          focusBorderColor="white"
                          onChange={handleChangeFullAddress}
                        />
                      </FormControl>
                      <FormControl color={"white"} isInvalid={false}>
                        <FormLabel color={"blue"}>
                          <span className={styles.formPresaleLabel}>{formPresaleDelivery.phoneNumber[lang_]}</span>
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents='none'>
                            <PhoneIcon color='gray.300' />
                          </InputLeftElement>
                          <Input
                            value={phoneNumber} 
                            isRequired={true}
                            color={"black"}
                            backgroundColor={"white"}
                            placeholder={""}
                            focusBorderColor="white"
                            onChange={handleChangePhoneNumber}
                          />
                        </InputGroup>
                        
                      </FormControl>
                      <div className={styles.rectangleSendEmail}>
                        <Button
                          colorScheme="#465c79"
                          variant="solid"
                          left={"0px"}
                          onClick={handlSendEmail}
                        >BUY ARTWORK</Button>
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
