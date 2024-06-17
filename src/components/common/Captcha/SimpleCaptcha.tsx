'use client'
import { FormControl, FormErrorMessage, FormLabel, Input, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import styles from './SimpleCaptcha.module.scss'

export interface SimpleCaptchaProps {
    setButtonSendActive: React.Dispatch<React.SetStateAction<boolean>>
    buttonSendActive: boolean
}

const SimpleCaptcha : React.FC<SimpleCaptchaProps> = ({
    setButtonSendActive, buttonSendActive
}) => {

    //---------------------------------------------------------------------
    const [num1, setNum1] = useState<number>(0)
    const [num2, setNum2] = useState<number>(0)
    const [correctAnswer, setCorrectAnswer] = useState<number>(0)
    const [userInput, setUserInput] = useState<string>('')
    const [challengeComplete, setChallengeComplete] = useState<boolean>(false)
    const [challengeFailed, setChallengeFailed] = useState<boolean>(false)
    const toast = useToast()

    //---------------------------------------------------------------------
    useEffect(
        () => {
            setNum1(Math.floor(Math.random() * 9 ) + 1)
            setNum2(Math.floor(Math.random() * 9 ) + 1)           
            setCorrectAnswer(num1 + num2)
        }
        ,[num1, num2]
    )

    //---------------------------------------------------------------------
    const handleCaptchaAnswerChange = (e: any) => {
        setUserInput(e.target.value)
        if (e.target.value == correctAnswer.toString()) {
            // Popup a succes toast if no errors.
            toast({
                title: 'Right answer ! Human checking successful ...',
                description: '',
                status: 'success',
                duration: 3000,
                isClosable: true,
                })
            setTimeout(
                () => {
                    setChallengeComplete(true)
                }
                , 1000 
            )    
            setButtonSendActive(true)
            
        }
        else {
            setChallengeComplete(false)
            setChallengeFailed(true)
            setTimeout(
                () => {
                    setChallengeFailed(false)
                }
                , 3000 
            )
            setButtonSendActive(false)
            return false
        }
    }

  return (

    <div style={{paddingTop: '20px'}}>
        {
            challengeComplete ? (
                <div className={styles.challengeComplete}>
                    Great ! You can now provide your e-mail ...
                </div>    
            )
            : 
            (
<FormControl>
            <FormLabel style={{fontFamily: 'Unbounded-Bold'}}>
                <span className={styles.questionCaptcha}>
                Verify that you are human : 
                </span>
                <span className={styles.questionCaptcha}>What is the sum of these 2 numbers : </span>
                <span className={styles.questionCaptcha}>{num1} &amp; </span>
                <span className={styles.questionCaptchaHidden}>five</span>
                <span className={styles.questionCaptchaHidden}>seven</span>
                <span className={styles.questionCaptcha}>{num2}</span>
                <span className={styles.questionCaptcha}>&nbsp;?</span>

                
            </FormLabel>
              <Input type='text' color={'grey'} backgroundColor={'white'} 
              placeholder='' 
              focusBorderColor='red'
              onChange={handleCaptchaAnswerChange} 
              size={'xs'}
              />
              
        </FormControl>
            )
        }        

        <p className={styles.challengeFailed}>
            {challengeFailed && (
                <span>Oups ! Wrong answer</span>
            )}
        </p>
        
    </div>
  )
}

export default SimpleCaptcha