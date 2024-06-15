import { ModalProps } from "@/types/types";
import {
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import useSharedLogicRegistrationTestnet from "./useSharedLogicRegistrationTestnet";
import { IoSend } from "react-icons/io5";
import styles from "./HeroSection.module.scss";
import { useEffect } from "react";

const RegistrationTestnet: React.FC<ModalProps> = ({
  title,
  description,
  showModal,
  setShowModal,
}) => {

  const {email, setEmail, isEmailValid, setEmailValid, validateEmail, handleChangeEmail, handlSendEmail, emailSent, setEmailSent}
    = useSharedLogicRegistrationTestnet()

  return (
    <Modal
      scrollBehavior="inside"
      size="lg"
      isOpen={showModal}
      onClose={() => setShowModal(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton size="xl" />
        <ModalBody padding="30px">
        <ModalHeader paddingX="0px">{title}</ModalHeader>
          <p dangerouslySetInnerHTML={{ __html: description }} />
          <div className={styles.frameTestnetRegistration} style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center'}}>
              <FormControl color={'white'} isInvalid={!isEmailValid}>
              <FormLabel color={'white'}></FormLabel>
                <Input type='email' color={'grey'} backgroundColor={'white'} 
                placeholder='e-mail' 
                focusBorderColor='white'
                onChange={handleChangeEmail} 
                />
                {/*<FormHelperText color={'white'}>We'll never share your email.</FormHelperText>*/}
                {!isEmailValid && <FormErrorMessage>Invalid email</FormErrorMessage>}
              </FormControl>
              <div className={styles.rectangleSendEmail}>
                <Button leftIcon={<IoSend />} colorScheme='#465c79' variant='solid' onClick={handlSendEmail} left={'5px'}>
                </Button>
              </div>            
            </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RegistrationTestnet;
