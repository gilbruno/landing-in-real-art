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
import { useEffect, useState } from "react";
import SimpleCaptcha from "@/components/common/Captcha/SimpleCaptcha";
import GoogleCaptchaWrapper from "@/app/captcha/google-captcha-wrapper";

const RegistrationTestnet: React.FC<ModalProps> = ({
  title,
  description,
  showModal,
  setShowModal,
}) => {

  const {email, setEmail, isEmailValid, setEmailValid, validateEmail, handleChangeEmail, handlSendEmail, emailSent, setEmailSent}
    = useSharedLogicRegistrationTestnet()

  const [buttonSendActive, setButtonSendActive] = useState(false);

  useEffect(
    () => {
      setButtonSendActive(false)
    }
    , []
  )

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
          <div className=''>
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
                <Button leftIcon={<IoSend />}  colorScheme='#465c79' variant='solid' 
                  isDisabled={!buttonSendActive}
                  onClick={handlSendEmail} left={'5px'}>
                </Button>
              </div>            
            </div>
            <div>
                <SimpleCaptcha buttonSendActive={buttonSendActive} setButtonSendActive={setButtonSendActive}/>
            </div>            
            
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RegistrationTestnet;
