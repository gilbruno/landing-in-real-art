"use client"
import styles from './Newsletter.module.scss'
import { useAppContext } from '../../../context'
import React, { useState } from "react";
import { Lang } from "../../../types/types";
import useSharedLogicNewsletter from './useSharedLogicNewsletter';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  flexbox,
  IconButton,
  Stack,
} from '@chakra-ui/react'
import { IoMdSend } from "react-icons/io"
import { IoSend } from "react-icons/io5"
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import Image from 'next/image';
import RegistrationNewsletter from './RegistrationNewsletter';

const Newsletter = () => {

    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang
  
    const {nlTexts, setNlTexts, 
      email, setEmail, isEmailValid, setEmailValid, checkboxNL, setCheckboxNL, 
      checkboxPS, setCheckboxPS, validateEmail, 
      handleChangeEmail, handleChangeCheckBoxNL, handleChangeCheckBoxPS, handleChangeCheckBoxNFTS, handlSendEmail} 
      = useSharedLogicNewsletter()

    const [modalNewsletterRegistration, setModalNewsletterRegistration] = useState<boolean>(false)

    return (
        <div id="newsLetter" className={styles.frameNewsLetter}>
          <div className={styles.frame36563}>
            <div className={styles.frame3351}>
              <div className={styles.newsletter}>{nlTexts.title[lang_]}</div>
              <div className={styles.newsletterP1}>
                {nlTexts.description[lang_]}
              </div>
            </div>

            <div className={styles.accessNewsletter}>
              <Button colorScheme='#465c79' variant='solid' onClick={() => setModalNewsletterRegistration(true)} left={'5px'}>
                Click !
              </Button>
            </div>            
            {
              /*
            
            <div style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center'}}>
              <FormControl color={'white'} isInvalid={!isEmailValid}>
              <FormLabel color={'white'}></FormLabel>
                <Input type='email' color={'grey'} backgroundColor={'white'} 
                placeholder={nlTexts.email_placeholder [lang_]} 
                focusBorderColor='white'
                onChange={handleChangeEmail} 
                />
                
                {!isEmailValid && <FormErrorMessage>{nlTexts.sendEmailErrorMsg[lang_]}</FormErrorMessage>}
              </FormControl>
              <div className={styles.rectangleSendEmail}>
                <Button leftIcon={<IoSend />} colorScheme='#465c79' variant='solid' onClick={handlSendEmail} left={'5px'}>
                </Button>
              </div>            
            </div>
            <div>
              <Stack spacing={5} direction='row'>
                
              </Stack>
            </div>
            */
            }
          </div>
          <RegistrationNewsletter
            title={nlTexts.title[lang_]}
            description={nlTexts.description[lang_]}
            showModal={modalNewsletterRegistration}
            setShowModal={setModalNewsletterRegistration}
          />
          <Image className={styles.imageNL} src="/img/home/roman_statue.png" alt='' width={568} height={548}/>
        </div>

    )
}

export default Newsletter