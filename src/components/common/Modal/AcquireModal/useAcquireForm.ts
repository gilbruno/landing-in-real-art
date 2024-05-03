import { useAppContext } from '@/context'
import { FormPresaleDelivery, Lang, OfferPrices } from '@/types/types'
import { Web3Address } from '@/types/web3-types'
import { validateEmail } from '@/utils/client/clientFunctions'
import parse from "html-react-parser"
import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { Address } from 'viem'
import { getBalance } from '@wagmi/core'
import { wagmiConfig } from '@/app/wagmiConfig'
import { ALREADY_BOOKED_ARTWORK, TX_REJECTED_BY_USER, USDT_DECIMALS, usdtAddress } from '@/web3/constants'
import { ResourceNftStatus } from '@prisma/client'
import { PresaleOrder } from '@/types/db-types'
import { IfpsProps } from '@/lib/pinata'
import { fetchBuyerInfosByPublicKey } from '@/lib/presaleArtworkOrder'

const useAcquireForm = (offerPrices: OfferPrices, formPresaleDelivery: FormPresaleDelivery, web3Address: Web3Address) => {

    //Get the language of the global context
    const {lang} = useAppContext()
    const lang_ = lang as Lang
    
    const ADDRESS_ZERO = '0x' as Address
    const LANG_FR = 'FR' as Lang
    const defaultPresaleOrder = {
        artistName: '',
        artworkName: '',
        hashArt: '',
        tokenId: 0,
        txHash: ADDRESS_ZERO,
        owner: ADDRESS_ZERO,
        collectionName: '',
        collectionSymbol: '',
        price: 0,
        status: ResourceNftStatus.UPLOADIPFS,
        offerNumber: 0,
        imageUri: '',
        gatewayImageUri: '',
        metadataUri: '',
        gatewayMetadataUri: '',
        lang: LANG_FR,
        contractAddress: ADDRESS_ZERO,
        maxCancelDate: new Date()

    }
    const [email, setEmail] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [fullAddress, setFullAddress] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [offerNumber, setOfferNumber] = useState<string>('1')
    const [offerPrice, setOfferPrice]   = useState<number>(offerPrices.price)
    const [isEmailValid, setEmailValid] = useState<boolean>(true)
    const [metadataUri, setMetadataUri] = useState<string>('')
    const [uploadingImgToIpfs, setUploadingImgToIpfs] = useState<boolean>(false)
    const [uploadingMetadataToIpfs, setUploadingMetadataToIpfs] = useState<boolean>(false)
    const [mintingNft, setMintingNft] = useState<boolean>(false)
    const [mustApproveUsd, setMustApproveUsd] = useState<boolean>(false)
    const [approvingUsd, setApprovingUsd] = useState<boolean>(false)
    const [buttonBuyDisabled, setButtonBuyDisabled] = useState<boolean>(false)
    const [idOrder, setIdOrder] = useState<number>(0)
    const [artworkBought, setArtworkBought] = useState<boolean>(false)

    const [orderInDb, setOrderInDb] = useState<PresaleOrder>(defaultPresaleOrder)
    const isFirstNameRequired    = firstName === ''
    const isLastNameRequired     = lastName === ''
    const isFullAddressRequired  = fullAddress === ''
    const isPhoneNumberRequired  = phoneNumber === ''

    const toast = useToast()

    /********** WEB3 *********/
    const [usdBalance, setUsdBalance] = useState<number>(0)

    const userPublicKey = web3Address as Address

    useEffect(
        () => {
            const fetchBuyer = async () => {
                const buyer = await fetchBuyerInfosByPublicKey(userPublicKey)
                if (buyer) {
                    setEmail(buyer.email)
                    setFirstName(buyer.firstName)
                    setLastName(buyer.lastName)
                    setFullAddress(buyer.address)
                    setPhoneNumber(buyer.phone)
                }
            }    
            fetchBuyer()
        }, []
    )

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

    //------------------------------------------------------------------------------ displayError
    const displayError = (msgError: string | undefined) => {
        if (msgError !== undefined) {
            //0xfb8f41b2 = Allowance not enough so we do not toast message but launch Metamask for approval
            if (msgError.includes('0xfb8f41b2')) {
                return
            }
            if (msgError.includes(TX_REJECTED_BY_USER)) {
                msgError = TX_REJECTED_BY_USER
            }
            if (msgError.includes(ALREADY_BOOKED_ARTWORK)) {
                msgError = formPresaleDelivery.msgErrorArtworkAlreadyBooked[lang_]
            }
            
            toast({
                title: parse(msgError),
                description: "",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }

    //------------------------------------------------------------------------------ displayInfo
    const displayInfo = (msgInfo: string, nbSeconds: number) => {
        toast({
            title: parse(msgInfo),
            description: "",
            status: "info",
            duration: nbSeconds * 1000,
            isClosable: true,
        })
    }

        //------------------------------------------------------------------------------ isOkToBuy
        const isOkToBuy = async () => {
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
    
            return success
        }
    
    
    return { email, setEmail, firstName, setFirstName, lastName, setLastName, fullAddress, setFullAddress, phoneNumber, setPhoneNumber,
        offerNumber, setOfferNumber, offerPrice, setOfferPrice, isEmailValid, setEmailValid, metadataUri, setMetadataUri, usdBalance, 
        uploadingImgToIpfs, setUploadingImgToIpfs, uploadingMetadataToIpfs, setUploadingMetadataToIpfs, mintingNft, setMintingNft,
        mustApproveUsd, setMustApproveUsd, approvingUsd, setApprovingUsd, artworkBought, setArtworkBought,
        buttonBuyDisabled, setButtonBuyDisabled, idOrder, setIdOrder, orderInDb, setOrderInDb,
        handleChangeEmail, handleChangeFirstName, handleChangeLastName, handleChangeFullAddress, handleChangePhoneNumber, isOkToBuy, displayInfo, displayError}
}

export default useAcquireForm