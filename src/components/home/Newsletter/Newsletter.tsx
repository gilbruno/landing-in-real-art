"use client"
import styles from './Newsletter.module.scss'
import { useAppContext } from '../../../context'
import React from "react";
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
} from '@chakra-ui/react'
import { IoMdSend } from "react-icons/io"
import { IoSend } from "react-icons/io5"

const Newsletter = () => {

    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang
  
    const {nlTexts, setNlTexts} = useSharedLogicNewsletter()
    /*
    const EmailInput = React.memo(() => {
      return <input type="text" className="email" autoFocus placeholder={emailPh}/>
    });
    */
  
    return (
        <div className={styles.frame36598}>
        <div className={styles.frame36563}>
          <div className={styles.frame3351}>
            <div className={styles.newsletter}>{nlTexts.title[lang_]}</div>
            <div className={styles.newsletterP1}>
              {nlTexts.description[lang_]}
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center'}}>
            <FormControl color={'white'}>
            <FormLabel color={'white'}>{nlTexts.email_placeholder [lang_]}</FormLabel>
              <Input type='email' color={'white'} placeholder={nlTexts.email_placeholder [lang_]} focusBorderColor='white'/>
              <FormHelperText color={'white'}>We'll never share your email.</FormHelperText>
            </FormControl>
            <div className={styles.rectangleSendEmail}>
            <Button leftIcon={<IoSend />} colorScheme='#465c79' variant='solid'>
            </Button>
            </div>            
          </div>
        </div>
        <img className={styles.imageNL} src="/img/unsplash-augtvvqxdhg.png" />
      </div>

    )
}

export default Newsletter