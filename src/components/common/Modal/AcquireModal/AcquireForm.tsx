"use client"
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons'
import { Button, ButtonGroup, CardFooter, FormControl, FormLabel, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Stack, useToast } from '@chakra-ui/react'
import styles from "./AcquireModal.module.scss"
import { ArtProps, FormPresaleDelivery, Lang, OfferPrices, PresaleArtworkOffers } from '../../../../types/types'
import { useAppContext } from '../../../../context'
import { useEffect, useState } from 'react'
import parse from "html-react-parser"
import { ALREADY_BOOKED_ARTWORK, Keccac256_Event_MetadataUpdate, Keccac256_NFTMinted_Event, USDT_DECIMALS, orderPhygitalArtAddress, usdtAddress } from '@/web3/constants'
import { getBalance } from '@wagmi/core'
import { wagmiConfig } from '@/app/wagmiConfig'
import { Address } from 'viem'
import { Lang as DbLang, ResourceNftStatus } from '@prisma/client'
import { fetchOrdersByUniqueKey, matchDbLang, createPresaleOrder, fetchOrderByHashArtwork, upsertBuyerPresale } from '@/lib/presaleArtworkOrder'
import { BuyerPresale, PresaleOrder, UpdateOrder } from '@/types/db-types'
import { IfpsProps } from '@/lib/pinata'
import { IraErc20TokenAbi } from '@/web3/abi/IraErc20TokenAbi'
import { OrderPhygitalArtAbi } from '@/web3/abi/OrderPhygitalArtAbi'
import { BaseError, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { Web3Address } from '@/types/web3-types'
import useAcquireForm from './useAcquireForm'

export interface AcquireFormProps {
    art: ArtProps
    formPresaleDelivery: FormPresaleDelivery
    offers: PresaleArtworkOffers
    offerPrices: OfferPrices
    web3Address: Web3Address
}
const AcquireForm = (props: AcquireFormProps) => {

    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang

    const IPFS_UPLOAD_METEDATA_LOCAL_ROUTE = '/api/pinata/metadata' as const
    const IPFS_UPLOAD_IMG_LOCAL_ROUTE = '/api/pinata/file' as const

    const {art, formPresaleDelivery, offers, offerPrices, web3Address} = props 
    const [artist, setArtist] = useState<string>(art.artistName)
    
    const { email, firstName, lastName, fullAddress, phoneNumber, offerNumber, setOfferNumber, offerPrice, setOfferPrice,isEmailValid, setEmailValid, metadataUri, setMetadataUri, usdBalance, 
        uploadingImgToIpfs, setUploadingImgToIpfs, uploadingMetadataToIpfs, setUploadingMetadataToIpfs, mintingNft, setMintingNft, 
        mustApproveUsd, setMustApproveUsd, approvingUsd, setApprovingUsd, artworkBought, setArtworkBought,
        buttonBuyDisabled, setButtonBuyDisabled, idOrder, setIdOrder, orderInDb, setOrderInDb,
        handleChangeEmail, handleChangeFirstName, handleChangeLastName, handleChangeFullAddress, handleChangePhoneNumber, isOkToBuy, displayInfo, displayError } = useAcquireForm(offerPrices, formPresaleDelivery, web3Address)

    
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

      const [allowanceUpdated, setAllowanceUpdated] = useState<number | unknown >(allowance)

      const { data: tokenIdBooked } = useReadContract({
        address: orderPhygitalArtAddress,
        abi: OrderPhygitalArtAbi,
        functionName: 'purchaseOrderIdOfHashArtworks',
        args: [art.artistName+'|'+art.artworkNameEN],
      })

    //------------------------------------------------------------------- useEffect "mintingNft"
    useEffect(
        () => {
            const mint = async () => {
                const price_ = Number(offerPrice)*Math.pow(10, USDT_DECIMALS)
                const order_tmp = await handleUploadOrderImgOnIpfs()
                const order = await handleUploadOrderMetadataOnIpfs(order_tmp)
                const publicKey = web3Address as Address
                order.status = ResourceNftStatus.MINED
                setOrderInDb(order)
                writeContract({
                    address: orderPhygitalArtAddress,
                    abi: OrderPhygitalArtAbi,
                    functionName: "mintPurchaseOrder",
                    args: [art.artistName, art.artworkName, price_, Number(offerNumber), publicKey, firstName, lastName, fullAddress, email, phoneNumber, order.metadataUri]
                })
            }

            if (mintingNft) {
                mint()
            }
        }, [mintingNft]
    )

    //------------------------------------------------------------------- useEffect "transactionData"
    useEffect(
        () => {
            const parseLogs = async () => {
                const eventLogs = transactionData?.logs
                let txHash
                if (eventLogs) {
                    //CASE OF APPROVAL USDT TRANSACTION
                    if (eventLogs.length == 1 ) {
                    //if (eventLogs[0].address.toLowerCase() == usdtAddress.toLowerCase()) {
                        console.dir('CAS APPROVAL : ', transactionData?.logs)
                        displayInfo('You approve USD to be spent. You can now buy the artwork')    
                        const allowanceHex = eventLogs[0].data
                        const allowanceUsd = parseInt(allowanceHex, 16)
                        setAllowanceUpdated(allowanceUsd)
                    }
                    else {
                        console.dir('CAS MINT : ', eventLogs)
                        let tokenIdHex = undefined
                        let tokenId = undefined
                        let maxCancelDateHex = undefined
                        let maxCancelDate = 0
                        for (let i = 0; i < eventLogs.length; i++) {
                            const eventLog = eventLogs[i]
                            console.log("EVENT LOG : ", eventLog)
                            txHash = eventLog.transactionHash
                            const topics = eventLog.topics
                            console.log("TOPICS : ", topics)
                            for (let j = 0; j < topics.length; j++) {
                                const topic = topics[j]
                                console.log("TOPIC : ", topic.toLowerCase())
                                if (topic.toLowerCase() == Keccac256_Event_MetadataUpdate.toLowerCase()) {
                                    tokenIdHex = eventLog.data
                                    tokenId = parseInt(tokenIdHex, 16)
                                    break
                                }
                                if (topic.toLowerCase() == Keccac256_NFTMinted_Event.toLowerCase()) {
                                    console.log("NFT Minted event !")
                                    maxCancelDateHex = topics[3] as string
                                    console.log('maxCancelDateHex : ', maxCancelDateHex)
                                    maxCancelDate = parseInt(maxCancelDateHex, 16)
                                    console.log('maxCancelDate : ', maxCancelDate)
                                }    
                            }       
                        }
                        console.log('TOKEN ID : ', tokenId)
                        console.log('TX HASH', txHash)
                        console.log('CHECK ORDER IN DB', orderInDb)
                        console.log('maxCancelDate ', maxCancelDate)
                        let maxCancelD = new Date(maxCancelDate * 1000)
                        orderInDb.tokenId = tokenId
                        orderInDb.txHash = txHash
                        orderInDb.contractAddress = orderPhygitalArtAddress
                        orderInDb.maxCancelDate = maxCancelD

                        if (tokenId !== undefined) {
                            console.log("CREATION DE LA COMMANDE EN DB ...", orderInDb)
                            createPresaleOrder(orderInDb)    
                        }
                        setArtworkBought(true)
                        displayInfo('You sucessfully ordered this artwork.')
                    }
                } 
                // setMintingNft(false)
            }
            if (isConfirmed && transactionData !== undefined) {
                parseLogs()
            }
            
        }, [isConfirmed]
    )

        //------------------------------------------------------------------- useEffect "artworkBought"
    //Handle error caused by smart contract reverts
    useEffect(
        () => {
            if (artworkBought) {
                displayInfo('You sucessfully ordered this artwork.')
            }
        }, [artworkBought]
    )

    //------------------------------------------------------------------- useEffect "error"
    //Handle error caused by smart contract reverts
    useEffect(
        () => {
            // console.log('ERROR : ', error?.message)
            // console.log('ERROR NAME : ', error?.name)
            // console.log('ERROR STACK : ', error?.stack)
            // console.log('ERROR CAUSE : ', error?.cause)
            const msgError = error?.message
            displayError(msgError)
            setMintingNft(false)
        }, [error]
    )

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
  
    //------------------------------------------------------------------------------ uploadOrderImageOnIpfs
    const uploadOrderImageOnIpfs = async (art: ArtProps) => {
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
  
    //--------------------------------------------------------------------------- handleUploadOrderImgOnIpfs
    const handleUploadOrderImgOnIpfs = async () => {
        // setUploadingImgToIpfs(true)
        const ipfsHash = await uploadOrderImageOnIpfs(art)
        //orderStatus = ResourceNftStatus.UPLOADIPFS
        const pKey = userPublicKey as Address
        let dbLang = await matchDbLang(lang) as DbLang
        const order =
        { 
            artistName: artist.trim(),
            artworkName: art.artworkNameEN.trim(),
            hashArt: art.artistName.trim()+'|'+art.artworkNameEN.trim(),
            owner: pKey,
            offerNumber: Number(offerNumber),
            price: offerPrice,
            status: ResourceNftStatus.UPLOADIPFS,
            imageUri: ipfsHash,
            gatewayImageUri: process.env.NEXT_PUBLIC_GATEWAY_URL + ipfsHash,
            lang: dbLang
        }
        return order 
    }

    //--------------------------------------------------------------------------- handleUploadOrderMetadataOnIpfs
    const handleUploadOrderMetadataOnIpfs = async (order: any) => {
        console.log('ORDER 2 ', order)
        const order_: PresaleOrder = order
        const imageUri = orderInDb.imageUri as string
        //setUploadingMetadataToIpfs(true)
        const data = {
            name: `${art.artistName} - ${art.artworkName}`,
            description: `${art.artistName} - ${art.artworkName}`,
            external_url: "https://inrealart.com/orders",
            image: `ipfs://${imageUri}`,
            attributes: [
                {
                    trait_type: 'orderPrice',
                    value: offerPrice
                },
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
        const gatewayMetadataUri = process.env.NEXT_PUBLIC_GATEWAY_URL as string + ipfsMetadataHash
        order_.status = ResourceNftStatus.UPLOADMETADATA
        order_.metadataUri = ipfsMetadataHash
        order_.gatewayMetadataUri = gatewayMetadataUri
        return order_
    }

    //--------------------------------------------------------------------------- isArtworkNotBooked
    const isArtworkNotBooked = async (hashArt: string) => {
        let order = await fetchOrderByHashArtwork(hashArt)
        return !order
    }

    //--------------------------------------------------------------------------- handleMintNfrOrder
    const handleMintNftOrder = async () => {
        setButtonBuyDisabled(true)
    }

    //------------------------------------------------------------------------------ upsertInfosBuyer
    const upsertInfosBuyer = async() => {
        const buyer_: BuyerPresale = {
            publicKey: web3Address as Address,
            email: email,
            firstName: firstName,
            lastName: lastName,
            address: fullAddress,
            phone: phoneNumber
        }
        const buyerCreatedOrUpdated = upsertBuyerPresale(buyer_)
        console.log('BUYER CREATED OR UPDATED : ', buyerCreatedOrUpdated)
    }

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
    }
    
    //------------------------------------------------------------------------------ handlBuyArtwork
    const handlBuyArtwork = async () => {
        //Check valid form (email format, adress, etc ...)
        let checkFormValues = await isOkToBuy()
        const hashArt = art.artistName+'|'+art.artworkNameEN
        let isArtworkNotBookedBool = isArtworkNotBooked(hashArt) // TODO
        let success = checkFormValues && isArtworkNotBookedBool
        displayInfo('Please wait ... your wallet will send the transaction shortly')
        upsertInfosBuyer()
        if (success) {
            setButtonBuyDisabled(true)
            await handlApproveUsd()
        }
    }

    //------------------------------------------------------------------------------ handlApproveUsd
    const handlApproveUsd = async() => {
        console.log('handlApproveUsd ...')
        let allowance_ = allowanceUpdated as number
        allowance_ = Number(allowance_) / Math.pow(10, USDT_DECIMALS) 
        allowance_ = (isNaN(allowance_) || (allowance_ === undefined))?0:allowance_
        //setAllowanceUpdated(allowance_)
        console.log('allowance_ : ', allowance_)
        console.log('offerPrice : ', offerPrice)
    
        
        if (allowance_ < offerPrice) {
            console.log('Launch approval popup ...')
            writeContract({
                address: usdtAddress,
                abi: IraErc20TokenAbi,
                functionName: 'approve',
                args: [orderPhygitalArtAddress, offerPrices.price3*Math.pow(10, USDT_DECIMALS)],
              })  
        }        
        else {
            setMintingNft(true)
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
                                value={email}
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
                        
                        { !artworkBought && 
                            <div className={styles.rectangleBuyNft}>
                                <Button
                                    disabled={buttonBuyDisabled}
                                    colorScheme="#465c79"
                                    variant="solid"
                                    left={"0px"}
                                    onClick={handlBuyArtwork}>
                                    BUY ARTWORK
                                </Button>
                            </div>                    
                        }

                        { artworkBought && 
                            <div className={styles.rectangleArtworkBought}>
                                ARTWORK BOUGHT !
                            </div>                    
                        }
                    </div>
                </div>
            </ButtonGroup>
        </div>
                
        </CardFooter>
    
    
    </>
  )
}

export default AcquireForm


