"use client"
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, CardFooter, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Stack, useToast } from '@chakra-ui/react'
import styles from "./AcquireModal.module.scss";
import { FormPresaleDelivery, Lang, PresaleArtworkOffers } from '../../../../types/types';
import { useAppContext } from '../../../../context';
import { useEffect, useState } from 'react';
import { validateEmail } from '../../../../utils/client/clientFunctions';
import parse from "html-react-parser";
import { OrderPhygitalArtAbi } from "../../../../web3/abi/OrderPhygitalArtAbi";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { USDT_DECIMALS, orderPhygitalArtAddress, usdtAddress } from '@/web3/constants';
import { IraErc20TokenAbi } from '@/web3/abi/IraErc20TokenAbi';
import { getBalance, simulateContract, writeContract} from '@wagmi/core'
import { wagmiConfig } from '@/app/wagmiConfig';
import { Address } from 'viem';
import { pinJSONToIPFS } from '@/utils/web3/pinata/functions';

export interface AcquireFormProps {
    art: {artistName: string, artworkName: string}
    formPresaleDelivery: FormPresaleDelivery
    offers: PresaleArtworkOffers
    offerPrices: {price: number, price2: number, price3: number}
    web3Address: `0x${string}` | undefined
}
const AcquireForm = (props: AcquireFormProps) => {

    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang

    const {art, formPresaleDelivery, offers, offerPrices, web3Address} = props 
    
    const [email, setEmail] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [fullAddress, setFullAddress] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [isEmailValid, setEmailValid] = useState<boolean>(true)
    const [offerNumber, setOfferNumber] = useState<string>('1')
    const [offerPrice, setOfferPrice]   = useState<number>(offerPrices.price)
    const [usdBalance, setUsdBalance] = useState<number>(0)
    const [uploadingImgToIpfs, setUploadingImgToIpfs] = useState<boolean>(false)
    const [uploadingMetadataToIpfs, setUploadingMetadataToIpfs] = useState<boolean>(false)
    const [buttonBuyDisabled, setButtonBuyDisabled] = useState<boolean>(false)

    const toast = useToast();
    const isFirstNameRequired    = firstName === ''
    const isLastNameRequired     = lastName === ''
    const isFullAddressRequired  = fullAddress === ''
    const isPhoneNumberRequired  = phoneNumber === ''

    //Web3
    // const { writeContract } = useWriteContract()
    const userPublicKey = web3Address as Address

    useEffect(
        () => {
            const fetchBalance = async () => {
                const balanceUSDT = await getBalance(wagmiConfig, {
                    address: userPublicKey,
                    token: usdtAddress,
                  })
                let balanceUSDT_ = Number(balanceUSDT.value.toString())
                balanceUSDT_ = balanceUSDT_ / Math.pow(10, USDT_DECIMALS)  
                setUsdBalance(balanceUSDT_)
            }    
            fetchBalance()
        }, [web3Address]
    )
    
    const uploadOrderImageOnIpfs = async () => {
        try {
          //setUploading(true);
          const formData = new FormData();
          const res = await fetch("/api/pinata/file", {
            method: "POST"
          });
          const ipfsHash = await res.text();
          //setUploading(false);
          return ipfsHash
          //setCid(ipfsHash);
          
        } catch (e) {
          console.log(e);
          setUploadingImgToIpfs(false);
          alert("Trouble uploading file");
        }
      };
    
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

    //------------------------------------------------------------------------------ handleOfferNumber
    const handleOfferNumber = async(e: any) => {
        setOfferNumber(e)
        if (e == 1) {
            setOfferPrice(offerPrices.price)
        }
        if (e == 2) {
            setOfferPrice(offerPrices.price2)
        }
        if (e == 3) {
            setOfferPrice(offerPrices.price3)
        }
        console.log("Offer number", e)
    }

    //--------------------------------------------------------------------------- handleMintNfrOrder
    const handleMintNftOrder = async () => {
        // setButtonBuyDisabled(true)
        // setUploadingImgToIpfs(true)
        //Step 1 : We must upload Image of the Order on IPFS and get the return Hash
        // const cid = await uploadOrderImageOnIpfs()
        // setUploadingImgToIpfs(false)

        //Step 2 : We must upload the metadata of the Order on IPFS and get the return Hash
        // setUploadingMetadataToIpfs(true)
        // await pinJSONToIPFS(cid as string, art.artistName, art.artworkName)
        // setUploadingMetadataToIpfs(false)
        
        //Step 3 : First we check the allowance with 
        //   - owner : the current connected account
        //   - spender : the OrderPhygitalArt smartcontract



        //STEP 4 : We must request an approve if there's no allowance
        //Ask user to approve that our smart contract be a spender
        const { request } = await simulateContract(wagmiConfig, {
            abi: IraErc20TokenAbi,
            address: usdtAddress,
            functionName: "approve",
            args: [orderPhygitalArtAddress, offerPrices.price3*Math.pow(10, USDT_DECIMALS)]
          })

        const hash = await writeContract(wagmiConfig, request)  
        
        // console.log(hash)

        //setButtonBuyDisabled(false)
        /*writeContract({
            abi: IraErc20TokenAbi,
            address: usdtAddress,
            functionName: "approve",
            args: [orderPhygitalArtAddress, offerPrices.price3*Math.pow(10, USDT_DECIMALS)],
            });
            */

    }

    //------------------------------------------------------------------------------ handlBuyArtwork
    const handlBuyArtwork = async () => {
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
            title: parse(formPresaleDelivery.msgErrorEmail[lang_]),
            description: "",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        }
        
        //Check USD Balance & toast an error if not sufficient funds
        if (offerPrice > usdBalance) {
            success = false
            // Popup an error toast
            toast({
                title: parse(formPresaleDelivery.msgErrorBalance[lang_]),
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
            await handleMintNftOrder()
        }
    }


  return (
    <>
              <CardFooter>
                <div className={styles.cardFooter}>
                    <div className={styles.connectedAddress}>Your connected address : {`${web3Address?.slice(0,6)}...${web3Address?.slice(-6)}`}</div>
                    <div className={styles.connectedAddress}>Your USD Balance : {usdBalance} USD</div>
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
                        <div style={{backgroundColor: "white",width: "100%", borderRadius: "10px", margin: "auto", paddingLeft: "20px"}}>
                            <RadioGroup onChange={handleOfferNumber} value={offerNumber}>
                                <Stack direction='row'> 
                                    <Radio value='1'>{offers.offer1[lang_]}</Radio>
                                    <Radio value='2'>{offers.offer2[lang_]}</Radio>
                                    <Radio value='3'>{offers.offer3[lang_]}</Radio>
                                </Stack>
                            </RadioGroup>    
                        </div>
                        <FormControl color={"white"} isInvalid={false}>
                            <FormLabel color={"blue"}>
                                <span className={styles.formPresaleLabel}>{formPresaleDelivery.price[lang_]}</span>
                            </FormLabel>
                            <InputGroup>
                            <Input
                                value={offerPrice}
                                color={"black"}
                                backgroundColor={"white"}
                                placeholder={""}
                                focusBorderColor="white"
                                disabled={true}
                            />
                            
                            </InputGroup>
                            
                        </FormControl>
                        
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
                                disabled={buttonBuyDisabled}
                                colorScheme="#465c79"
                                variant="solid"
                                left={"0px"}
                                onClick={handlBuyArtwork}>
                                { (!uploadingImgToIpfs && !uploadingMetadataToIpfs) && "BUY ARTWORK" } 
                                { uploadingImgToIpfs && "Uploading Image to IPFS..." }
                                { uploadingMetadataToIpfs && "Uploading Metadata to IPFS..." }
                            </Button>
                        </div>
                        </div>
                    </div>
                    </ButtonGroup>
                </div>
                
              </CardFooter>
    
    
    </>
  )
}

export default AcquireForm


