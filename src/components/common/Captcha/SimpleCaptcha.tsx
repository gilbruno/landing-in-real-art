'use client'
import { Button, FormControl, FormErrorMessage, FormLabel, Input, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import styles from './SimpleCaptcha.module.scss'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

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
    const [captchaAnswer, setCaptchaAnswer] = useState<string>('')
    const [challengeComplete, setChallengeComplete] = useState<boolean>(false)
    const [challengeFailed, setChallengeFailed] = useState<boolean>(false)
    const toast = useToast()
    const [notificationCaptchaError, setNotificationCaptchaError] = useState<string>('');
    const [notificationCaptchaSuccess, setNotificationCaptchaSuccess] = useState<string>('');
    //---------------------------------------------------------------------
    useEffect(
        () => {
            setNum1(Math.floor(Math.random() * 9 ) + 1)
            setNum2(Math.floor(Math.random() * 9 ) + 1)           
            setCorrectAnswer(num1 + num2)
        }
        ,[num1, num2]
    )

    const { executeRecaptcha } = useGoogleReCaptcha();
    
    //---------------------------------------------------------------------
    const handleSubmitCatchpaForm = async (e: any) => {
        console.log('CAPTCHA ANSWER : ', captchaAnswer)
        console.log('Correct answer : ', correctAnswer.toString())
        if (captchaAnswer != correctAnswer.toString()) {
            setNotificationCaptchaError('Wrong answer !')
        }    
        else {
            e.preventDefault();
            if (!executeRecaptcha) {
              console.log("Execute recaptcha not available yet");
              setNotificationCaptchaError(
                "Execute recaptcha not available yet likely meaning key not recaptcha key not set"
              );
              return;
            }
            executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
              submitEnquiryForm(gReCaptchaToken);
            });    

            //setNotificationCaptcha('Correct answer : you can provide your e-mail')
        }

        
    }

    //---------------------------------------------------------------------
    const submitEnquiryForm = async (gReCaptchaToken: string) => {
        console.log('gReCaptchaToken', gReCaptchaToken)
        try {
          const response = await fetch("/api/captchaSubmit", {
            method: "POST",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              captchaAnswer: captchaAnswer,
              gRecaptchaToken: gReCaptchaToken,
            }),
          });
    
          const data = await response.json();
          console.log(data)
          if (data?.success === true) {
            console.log(`Success with score: ${data?.score}`)
            setNotificationCaptchaSuccess(`Human checking successful ! You can now provide your e-mail ...`);
            setButtonSendActive(true)
          } else {
            setNotificationCaptchaError(`Failure with score: ${data?.score}`);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          setNotificationCaptchaError("Error submitting form. Please try again later.");
        }
      };

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
            notificationCaptchaSuccess ? (
                <div className={styles.challengeComplete}>
                    {notificationCaptchaSuccess}
                </div>    
            )
            : 
            (

                 <div className=''>
                    <main className=""> {/* Add a top margin for better spacing */}
                        <span className={styles.questionCaptcha}>Verify that you are human : </span><br/>
                        <span className={styles.questionCaptcha}>What is the sum of these 2 numbers : </span>
                        <span className={styles.questionCaptcha}>{num1} &amp; </span>
                        <span className={styles.questionCaptchaHidden}>five</span>
                        <span className={styles.questionCaptchaHidden}>seven</span>
                        <span className={styles.questionCaptcha}>{num2}</span>
                        <span className={styles.questionCaptcha}>&nbsp;?</span>    
                        
                            <div className="mb-3">
                            <input
                                type="text"
                                name="captchaAnswer"
                                value={captchaAnswer}
                                onChange={(e) => setCaptchaAnswer(e?.target?.value)}
                                className={styles.inputCaptchaAnswer}
                                placeholder="Your answer"
                            />
                            </div>
                            
                            <button onClick={handleSubmitCatchpaForm} className={styles.rectangleSendCaptcha}>Submit</button>
                            {notificationCaptchaError && <p className={styles.challengeFailed}>{notificationCaptchaError}</p>}
                        
                    </main>
                </div>

            /*    
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
                
                <button type="submit" className="btn btn-light">Check</button>
            </FormControl>
            */
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