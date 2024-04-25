"use client"
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, CardFooter, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Stack, useToast } from '@chakra-ui/react'
import styles from "./AcquireModal.module.scss"
import { FormPresaleDelivery, Lang, PresaleArtworkOffers } from '../../../../types/types'
import { useAppContext } from '../../../../context'
import { useEffect, useState } from 'react'
import { validateEmail } from '../../../../utils/client/clientFunctions'
import parse from "html-react-parser"
import { USDT_DECIMALS, orderPhygitalArtAddress, usdtAddress } from '@/web3/constants'
import { getBalance, simulateContract, writeContract} from '@wagmi/core'
import { wagmiConfig } from '@/app/wagmiConfig'
import { Address } from 'viem'
import { pinJSONToIPFS } from '@/utils/web3/pinata/functions'
import { supabase } from '@/utils/supabase/supabaseConnection'
import { PRESALE_ARTWORK_ORDER_TABLE } from '@/utils/supabase/constants'
import { Lang as DbLang, ResourceNftStatus } from '@prisma/client'
import { createOrder, fetchOrdersByUniqueKey, matchDbLang, updateOrder, updateOrderByUniqueKey } from '@/lib/presaleArtworkOrder'
import { CreateOrder, UpdateOrder } from '@/types/db-types'
import { IfpsProps, pinJsonToIpfs } from '@/lib/pinata'
import { IraErc20TokenAbi } from '@/web3/abi/IraErc20TokenAbi'

export interface AcquireFormProps {
    art: {imageUrl: string, artistName: string, artworkName: string}
    formPresaleDelivery: FormPresaleDelivery
    offers: PresaleArtworkOffers
    offerPrices: {price: number, price2: number, price3: number}
    web3Address: `0x${string}` | undefined
}
const AcquireForm = (props: AcquireFormProps) => {

    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang

    const IPFS_UPLOAD_IMG_LOCAL_ROUTE = '/api/pinata/file' as const
    const IPFS_UPLOAD_METEDATA_LOCAL_ROUTE = '/api/pinata/metadata' as const
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
    const [mintingNft, setMintingNft] = useState<boolean>(false)
    const [buttonBuyDisabled, setButtonBuyDisabled] = useState<boolean>(false)

    const toast = useToast()
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
    
    //------------------------------------------------------------------------------ insertPresaleTable
    const insertPresaleOrder = async (ipfsHash: string) => {
        const pKey = userPublicKey as string
        let dbLang = await matchDbLang(lang_) as DbLang
        const data =
            { 
                artistName: art.artistName,
                artworkName: art.artworkName,
                owner: pKey,
                offerNumber: Number(offerNumber),
                price: offerPrice,
                status: ResourceNftStatus.UPLOADIPFS,
                imageUri: ipfsHash,
                gatewayImageUri: process.env.NEXT_PUBLIC_GATEWAY_URL + ipfsHash,
                lang: dbLang
            }
        const order = await createOrder(data)
        return order
        // if (error?.code == CODE_UNIQUE_KEY_VIOLATION) {
        //     msgError = 'This email already exists in our e-mail base'    
        // }
        // else {
        //     if (error) throw error  
        // }
        // return msgError
    }

    //------------------------------------------------------------------------------ insertPresaleTable
    const updatePresaleOrder = async (idOrder: number, ipfsMetadataHash: string) => {
        const gatewayMetadataUri = process.env.NEXT_PUBLIC_GATEWAY_URL as string + ipfsMetadataHash
        const dataToUpdate =
            { 
                status: ResourceNftStatus.UPLOADMETADATA,
                metadataUri: ipfsMetadataHash,
                gatewayMetadataUri: gatewayMetadataUri
            }
        await updateOrder(idOrder, dataToUpdate)
    }
    
    //------------------------------------------------------------------------------ updatePresaleTableForMetadata
    const updatePresaleTableForMetadata = async () => {
        
        //Step 1 : Check if the record exist in DB by unique key : owner|artistName|artworkName|offerNumber
        const order = await fetchOrdersByUniqueKey(userPublicKey, art.artistName, art.artworkName, Number(offerNumber))
        if (!order) {
            const { error } = await supabase
            .from(PRESALE_ARTWORK_ORDER_TABLE)
            .insert(
                { 
                    artistName: art.artistName,
                    artworkName: art.artworkName,
                    owner: userPublicKey,
                    offerNumber: offerNumber,
                    price: offerPrice,
                    status: ResourceNftStatus.UPLOADIPFS
                })
        
        }
        // if (error?.code == CODE_UNIQUE_KEY_VIOLATION) {
        //     msgError = 'This email already exists in our e-mail base'    
        // }
        // else {
        //     if (error) throw error  
        // }
        // return msgError
    }

    //------------------------------------------------------------------------------ uploadOrderImageOnIpfs
    const uploadOrderImageOnIpfs = async () => {
        const fileUrl = art.imageUrl
        const artwork = `${art.artistName} - ${art.artworkName}`
        try {
            const response = await fetch(IPFS_UPLOAD_IMG_LOCAL_ROUTE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileUrl, artwork })
            })

            console.log('RESPONSE :', response )
            if (!response.ok) {
                throw new Error('Failed to upload to IPFS')
            }
            const data = await response.json()
            console.log('IPFS Hash:', data.IpfsHash)
            return data.IpfsHash
        } catch (error) {
            console.error('Error uploading file:', error)
            return null
        }
    }

    //------------------------------------------------------------------------------ uploadOrderMetadataOnIpfs
    const uploadOrderMetadataOnIpfs = async (data: IfpsProps) => {
        const data_ = data
        try {
            const response = await fetch(IPFS_UPLOAD_METEDATA_LOCAL_ROUTE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data_)
            })

            console.log('RESPONSE :', response )
            if (!response.ok) {
                throw new Error('Failed to upload to IPFS')
            }
            const data = await response.json()
            console.log('IPFS Hash:', data.IpfsHash)
            return data.IpfsHash
        } catch (error) {
            console.error('Error uploading file:', error)
            return null
        }
    }

    //------------------------------------------------------------------------------ handleChangeEmail
    const handleChangeEmail = (e: any) => setEmail(e.target.value)

    //-------------------------------------------------------------------------- handleChangeFirstName
    const handleChangeFirstName = (e: any) => setFirstName(e.target.value)

    //-------------------------------------------------------------------------- handleChangeLastName
    const handleChangeLastName = (e: any) => setLastName(e.target.value)

    //------------------------------------------------------------------------ handleChangeFullAddress
    const handleChangeFullAddress = (e: any) => setFullAddress(e.target.value)

    //------------------------------------------------------------------------ handleChangePhoneNumber
    const handleChangePhoneNumber = (e: any) => setPhoneNumber(e.target.value)

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
        setButtonBuyDisabled(true)

        //Step 1 : Check if the record exist in DB by unique key : owner|artistName|artworkName|offerNumber
        let order = await fetchOrdersByUniqueKey(userPublicKey, art.artistName, art.artworkName, Number(offerNumber))
        console.log('ORDER', order)
        let orderStatus = order?.status
        //If id does not exist, we upload the image on IPFS via Pinata
        if (!order) {
            setUploadingImgToIpfs(true)
            const ipfsHash = await uploadOrderImageOnIpfs()
            console.log('ipfsHash returned : ', ipfsHash)
            orderStatus = ResourceNftStatus.UPLOADIPFS
            order = await insertPresaleOrder(ipfsHash)
            setUploadingImgToIpfs(false)
        }
            
        //If the order has the status "UPLOADIPFS", we must upload the JSON metadata on IPFS and get the return Hash
        if (orderStatus == ResourceNftStatus.UPLOADIPFS) {
            const imageUri = order?.imageUri as string
            setUploadingMetadataToIpfs(true)
            const data = {
                name: `${art.artistName} - ${art.artworkName}`,
                description: `${art.artistName} - ${art.artworkName}`,
                external_url: "https://inrealart.com/orders",
                image: `ipfs://${imageUri}`,
                attributes: [
                    {
                        trait_type: 'orderDate',
                        value: (new Date()).toString()
                    },
                    {
                        trait_type: 'gatewayImageUri',
                        value: process.env.NEXT_PUBLIC_GATEWAY_URL + imageUri
                    }
                ]
              } as IfpsProps
            const ipfsMetadataHash = await uploadOrderMetadataOnIpfs(data)
            updatePresaleOrder(order.id, ipfsMetadataHash)
            setUploadingMetadataToIpfs(false)

        }
        if (orderStatus == ResourceNftStatus.UPLOADMETADATA) {
            setMintingNft(true)
            //Step 3 : First we check the allowance with 
            //   - owner : the current connected account
            //   - spender : the OrderPhygitalArt smartcontract



            //STEP 4 : We must request an approve if there's no allowance
            //Ask user to approve that our smart contract be a spender
            console.log('IraErc20TokenAbi : ', IraErc20TokenAbi)
            console.log('usdtAddress : ', usdtAddress)
            console.log('offerPrices.price3 : ', offerPrices.price3)
            const { request } = await simulateContract(wagmiConfig, {
                abi: IraErc20TokenAbi,
                address: usdtAddress,
                functionName: "approve",
                args: [orderPhygitalArtAddress, offerPrices.price3*Math.pow(10, USDT_DECIMALS)]
              })

            const hash = await writeContract(wagmiConfig, request)  
            console.log(hash)

            //setButtonBuyDisabled(false)
            /*writeContract({
                abi: IraErc20TokenAbi,
                address: usdtAddress,
                functionName: "approve",
                args: [orderPhygitalArtAddress, offerPrices.price3*Math.pow(10, USDT_DECIMALS)],
                })
                */
            setMintingNft(true)
        }    
    }

    //------------------------------------------------------------------------------ handlBuyArtwork
    const handlBuyArtwork = async () => {
        let success = true
        if (validateEmail(email)) {
        setEmailValid(true)
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
        setEmailValid(false)
        success = false
        // Popup an error toast
        toast({
            title: parse(formPresaleDelivery.msgErrorEmail[lang_]),
            description: "",
            status: "error",
            duration: 3000,
            isClosable: true,
        })
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
            })
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
            })
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
            })
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
            })
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
            })
        }

        //If an offerPrice is missed (aka not set in Firebase)
        //Toast an error
        if (offerPrices.price === undefined || offerPrices.price2 === undefined || offerPrices.price3 === undefined) {
            toast({
                title: parse(formPresaleDelivery.msgErrorOfferPrices[lang_]),
                description: "",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
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


