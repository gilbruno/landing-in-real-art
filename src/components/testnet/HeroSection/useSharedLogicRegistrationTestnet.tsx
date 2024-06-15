import { useEffect, useState } from "react"
import { Lang, NewsletterData, NewsletterText, defaultLangObject } from "../../../types/types"
import { db } from '../../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore/lite'
import { supabase } from "../../../utils/supabase/supabaseConnection"
import {CODE_UNIQUE_KEY_VIOLATION, COLLECTION_NFTS_TABLE, NEWSLETTER_TABLE, PRIVATESALE_TABLE, TESTNET_TABLE} from '../../../utils/supabase/constants'
import { useToast } from '@chakra-ui/react'
import parse from 'html-react-parser'
import { useAppContext } from "../../../context"

const useSharedLogicRegistrationTestnet = () => {
    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang
  
    const toast = useToast()
    
    const [email, setEmail]               = useState('')
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

    //------------------------------------------------------------------------------ handlSendEmail
    const handlSendEmail = async () => {
      
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
            }
          } catch (error) {
            throw error
          }

      } else {
          setEmailValid(false)
      }
    }
    

    return {email, setEmail, isEmailValid, setEmailValid, validateEmail, handleChangeEmail, handlSendEmail}
}    

export default useSharedLogicRegistrationTestnet