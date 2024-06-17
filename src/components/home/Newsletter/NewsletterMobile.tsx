"use client"
import { Button, Checkbox, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Stack } from '@chakra-ui/react'
import { useAppContext } from '../../../context'
import { Lang } from '../../../types/types'
import styles from './NewsletterMobile.module.scss'
import useSharedLogicNewsletter from './useSharedLogicNewsletter'
import { IoSend } from 'react-icons/io5'
import { useState } from 'react'
import RegistrationNewsletter from './RegistrationNewsletter'

const NewsletterMobile = () => {

    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang
  
    const {nlTexts, setNlTexts, 
      email, setEmail, isEmailValid, setEmailValid, checkboxNL, setCheckboxNL, 
      checkboxPS, setCheckboxPS, validateEmail, 
      handleChangeEmail, handleChangeCheckBoxNL, handleChangeCheckBoxPS, handlSendEmail} 
      = useSharedLogicNewsletter()
  
    const [modalNewsletterRegistration, setModalNewsletterRegistration] = useState<boolean>(false)

    return (
      <div className={styles["frame-newsLetter-mobile"]}>
      <img className={styles["unsplash-a-ug-tvv-qx-dhg"]} src="img/img-newsletter-mobile.png" alt=''/>
      <div className={styles["frame-36598"]}>
        <div className={styles["newsletter"]}>{nlTexts.title[lang_]}</div>
        <div className={styles["newsletter-description"]}>{nlTexts.description[lang_]}</div>

        <div className={styles.accessNewsletter}>
          <Button colorScheme='#465c79' variant='solid' onClick={() => setModalNewsletterRegistration(true)} left={'5px'}>
            Click !
          </Button>
        </div>            
        <RegistrationNewsletter
            title={nlTexts.title[lang_]}
            description={nlTexts.description[lang_]}
            showModal={modalNewsletterRegistration}
            setShowModal={setModalNewsletterRegistration}
          />
  

      </div>
    </div>

    )
}

export default NewsletterMobile