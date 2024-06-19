import { useEffect, useState } from "react"
import { Lang, NewsletterData, NewsletterText, defaultLangObject } from "../../../types/types"
import { db } from '../../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore/lite'
import { supabase } from "../../../utils/supabase/supabaseConnection"
import {CODE_UNIQUE_KEY_VIOLATION, COLLECTION_NFTS_TABLE, NEWSLETTER_TABLE, PRIVATESALE_TABLE, TESTNET_TABLE} from '../../../utils/supabase/constants'
import { useToast } from '@chakra-ui/react'
import parse from 'html-react-parser'
import { useAppContext } from "../../../context"
import { PostDataSingleMailing } from "@/types/mailing.types"

const useSharedLogicRegistrationTestnet = () => {
    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang
  
    const toast = useToast()
    
    const [email, setEmail]               = useState('')
    const [emailSent, setEmailSent]       = useState<boolean>(false)
    const [isEmailValid, setEmailValid]   = useState(true)

    // Email validation function
    const validateEmail = (email: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(String(email).toLowerCase());
    }

    const handleChangeEmail = (e: any) => setEmail(e.target.value)

    //------------------------------------------------------------------------------ insertEmail
    const insertEmail = async (table: string) => {
      let msgError = ''
      const { error } = await supabase
        .from(table)
        .insert({ email: email })
      if (error?.code == CODE_UNIQUE_KEY_VIOLATION) {
        msgError = 'This email already exists in our e-mail base'    
      }
      else {
        if (error) throw error  
      }
      return msgError
    }

    //-------------------------------------------------------------------- sendMail
    const sendMail = async (paramsEmail: Partial<PostDataSingleMailing>) => {
      try {
        const response = await fetch("/api/mailing", {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paramsEmail)
        })

        const data = await response.json()
        console.log('Data returned after sending mail', data)
        return data
      } catch (error) {
        console.error("Error sendMail:", error)
      }
    }

    //------------------------------------------------------------------------------ handlSendEmail
    const handlSendEmail = async (e: any) => {
      e.preventDefault();
      if (validateEmail(email)) {
          setEmailValid(true)
          try {
            //Insert in Testnet Table
            const msgError = await insertEmail(TESTNET_TABLE)
            console.log('msgError : ', msgError)
            if (msgError !== '') {
              toast({
                title: msgError,
                description: '',
                status: 'error',
                duration: 3000,
                isClosable: true,
              })  
            }
            else {
              // Popup a succes toast if no errors.
              toast({
                title: 'Congrats ! Registration on the testnet successful.',
                description: '',
                status: 'success',
                duration: 3000,
                isClosable: true,
              })

              //Then Send an email
              /*
              const dataMail = await sendMail({
                to: email,
                templateName: 'TestnetRegistration'
              })
              console.log('DATA EMAIL : ', dataMail)
              if (dataMail.mailSent === false) {
                toast({
                  title: 'Unable to send you an e-mail ... Try later please',
                  description: '',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                }) 
              }
              */

            }
          } catch (error) {
            throw error
          }

      } else {
          setEmailValid(false)
      }
    }
    

    return {email, setEmail, isEmailValid, setEmailValid, validateEmail, handleChangeEmail, handlSendEmail, emailSent, setEmailSent}
}    

export default useSharedLogicRegistrationTestnet