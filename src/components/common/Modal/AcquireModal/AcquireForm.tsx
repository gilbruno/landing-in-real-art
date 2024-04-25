"use client"
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, CardFooter, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Stack, useToast } from '@chakra-ui/react'
import styles from "./AcquireModal.module.scss"
import { FormPresaleDelivery, Lang, OfferPrices, PresaleArtworkOffers } from '../../../../types/types'
import { useAppContext } from '../../../../context'
import { useEffect, useState } from 'react'
import { validateEmail } from '../../../../utils/client/clientFunctions'
import parse from "html-react-parser"
import { USDT_DECIMALS, orderPhygitalArtAddress, usdtAddress } from '@/web3/constants'
import { getBalance } from '@wagmi/core'
import { wagmiConfig } from '@/app/wagmiConfig'
import { Address } from 'viem'
import { pinJSONToIPFS } from '@/utils/web3/pinata/functions'
import { supabase } from '@/utils/supabase/supabaseConnection'
import { PRESALE_ARTWORK_ORDER_TABLE } from '@/utils/supabase/constants'
import { Lang as DbLang, ResourceNftStatus } from '@prisma/client'
import { createOrder, fetchOrdersByUniqueKey, matchDbLang, updateOrder, updateOrderByUniqueKey, updatePresaleOrder, insertPresaleOrder } from '@/lib/presaleArtworkOrder'
import { CreateOrder, UpdateOrder } from '@/types/db-types'
import { IfpsProps, pinJsonToIpfs } from '@/lib/pinata'
import { IraErc20TokenAbi } from '@/web3/abi/IraErc20TokenAbi'
import { OrderPhygitalArtAbi } from '@/web3/abi/OrderPhygitalArtAbi'
import { useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import customHookAcquireForm from './customHookAcquireForm'
import { Web3Address } from '@/types/web3-types'

export interface AcquireFormProps {
    art: {imageUrl: string, artistName: string, artworkName: string}
    formPresaleDelivery: FormPresaleDelivery
    offers: PresaleArtworkOffers
    offerPrices: OfferPrices
    web3Address: Web3Address
}
const AcquireForm = (props: AcquireFormProps) => {

    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang

    const IPFS_UPLOAD_IMG_LOCAL_ROUTE = '/api/pinata/file' as const
    const IPFS_UPLOAD_METEDATA_LOCAL_ROUTE = '/api/pinata/metadata' as const
    const {art, formPresaleDelivery, offers, offerPrices, web3Address} = props 
    
    const { email, setEmail, firstName, setFirstName, lastName, setLastName, fullAddress, setFullAddress, phoneNumber, setPhoneNumber, 
        offerNumber, setOfferNumber, offerPrice, setOfferPrice, isEmailValid, setEmailValid, metadataUri, setMetadataUri,
        handleChangeEmail, handleChangeFirstName, handleChangeLastName, handleChangeFullAddress, handleChangePhoneNumber, handleOfferNumber } = customHookAcquireForm(offerPrices)

    
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

    /*************************  Web3  *******************************/
    // const { writeContract } = useWriteContract()
    const userPublicKey = web3Address as Address
    const {
        data: hash,
        isPending,
        writeContract,
        status,
        error,
        isError: writeContractError,
      } = useWriteContract()

      const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        isError,
        error: transactionError,
        data: transactionData,
      } = useWaitForTransactionReceipt({ hash })
      
      const { data: allowance } = useReadContract({
        address: usdtAddress,
        abi: IraErc20TokenAbi,
        functionName: 'allowance',
        args: [web3Address, orderPhygitalArtAddress],
      })
    // const resultTxReceipt = useWaitForTransactionReceipt({hash})
    
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
    
    useEffect(
        () => {
            const mintPurchaseNft = async () => {
                if (transactionData?.contractAddress === usdtAddress) {
                    console.log("MINT NFT !!!")
                    writeContract({
                        abi: OrderPhygitalArtAbi,
                        address: orderPhygitalArtAddress,
                        functionName: "mintPurchaseOrder",
                        args: [art.artistName, art.artworkName, Number(offerPrice), Number(offerNumber), firstName, lastName, fullAddress, email, phoneNumber, metadataUri]
                    })
                }
                else if (transactionData?.contractAddress === orderPhygitalArtAddress) {
                    console.log("MINT TERMINE ! ")
                }

            }    
            mintPurchaseNft()
        }, [isConfirmed]
    )

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

            if (!response.ok) {
                throw new Error('Failed to upload to IPFS')
            }
            const data = await response.json()
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

            if (!response.ok) {
                throw new Error('Failed to upload to IPFS')
            }
            const data = await response.json()
            return data.IpfsHash
        } catch (error) {
            console.error('Error uploading file:', error)
            return null
        }
    }

    const getAllowance = (owner: string, spender: string) => {
        const { data } = useReadContracts({
            allowFailure: false,
            contracts: [
              {
                address: usdtAddress,
                abi: IraErc20TokenAbi,
                functionName: 'allowance',
                args: [owner, spender],
              }
            ],
          })
          const [allowance] = data || []
          const allowance_ = allowance as number
        return allowance_ 
    }

    //--------------------------------------------------------------------------- handleMintNfrOrder
    const handleMintNftOrder = async () => {
        setButtonBuyDisabled(true)

        //Step 1 : Check if the record exist in DB by unique key : owner|artistName|artworkName|offerNumber
        let order = await fetchOrdersByUniqueKey(userPublicKey, art.artistName, art.artworkName, Number(offerNumber))
        let orderStatus = order?.status
        //If id does not exist, we upload the image on IPFS via Pinata
        if (!order) {
            setUploadingImgToIpfs(true)
            const ipfsHash = await uploadOrderImageOnIpfs()
            orderStatus = ResourceNftStatus.UPLOADIPFS
            order = await insertPresaleOrder(ipfsHash, userPublicKey, art.artistName, art.artworkName, offerNumber, offerPrice, lang_)
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
            await updatePresaleOrder(order.id, ipfsMetadataHash)
            setUploadingMetadataToIpfs(false)
            order = await fetchOrdersByUniqueKey(userPublicKey, art.artistName, art.artworkName, Number(offerNumber))
            orderStatus = order?.status
            const metadataUri_ = metadataUri as string
            setMetadataUri(metadataUri_)
        }
        if (orderStatus === ResourceNftStatus.UPLOADMETADATA) {
            setMintingNft(true)
            order = await fetchOrdersByUniqueKey(userPublicKey, art.artistName, art.artworkName, Number(offerNumber))
            
            const allowance_ = Number(allowance) / Math.pow(10, USDT_DECIMALS)
            console.log('ALLOWANCE : ', allowance_)
            if (allowance_ < offerPrice) {
              writeContract({
                address: usdtAddress,
                abi: IraErc20TokenAbi,
                functionName: 'approve',
                args: [orderPhygitalArtAddress, offerPrices.price3*Math.pow(10, USDT_DECIMALS)],
              })
            }
            else {
                
            }
            // if (Number(allowance)/ >= offerPrice)

            //STEP 3 : We must request an approve if there's no allowance
            //Ask user to approve that our smart contract be a spender
            //   - owner : the current connected account
            //   - spender : the OrderPhygitalArt smartcontract

            //   writeContract({
            //     address: usdtAddress,
            //     abi: IraErc20TokenAbi,
            //     functionName: 'approve',
            //     args: [orderPhygitalArtAddress, offerPrices.price3*Math.pow(10, USDT_DECIMALS)],
            //   })

            // writeContract({
            //     address: usdtAddress as Address,
            //     abi: IraErc20TokenAbi,
            //     functionName: "approve",
            //     args: [orderPhygitalArtAddress, offerPrices.price3*Math.pow(10, USDT_DECIMALS)]
            // })

            // const requestMint = await simulateContract(wagmiConfig, {
            //     abi: OrderPhygitalArtAbi,
            //     address: orderPhygitalArtAddress,
            //     functionName: "mintPurchaseOrder",
            //     args: [art.artistName, art.artworkName, Number(offerPrice), Number(offerNumber), firstName, lastName, fullAddress, email, phoneNumber, order?.metadataUri]
            //   })

            // const hashMint = await writeContract(wagmiConfig, requestMint.request)  
            
            // console.log(hashMint)

            //setButtonBuyDisabled(false)
            /*writeContract({
                abi: IraErc20TokenAbi,
                address: usdtAddress,
                functionName: "approve",
                args: [orderPhygitalArtAddress, offerPrices.price3*Math.pow(10, USDT_DECIMALS)],
                })
                */
            setMintingNft(false)
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
                                { mintingNft && "Minting NFT..." }
                                
                            </Button>
                            
                        </div>
                        <div>
                        {isConfirmed && <div>CONFIRMED </div>}
                        {transactionData && <div>{transactionData?.contractAddress}</div>}
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


