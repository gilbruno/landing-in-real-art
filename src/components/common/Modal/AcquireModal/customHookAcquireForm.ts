import { OfferPrices } from '@/types/types'
import { Web3Address } from '@/types/web3-types'
import React, { useState } from 'react'

const customHookAcquireForm = (offerPrices: OfferPrices) => {

    const [email, setEmail] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [fullAddress, setFullAddress] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [offerNumber, setOfferNumber] = useState<string>('1')
    const [offerPrice, setOfferPrice]   = useState<number>(offerPrices.price)
    const [isEmailValid, setEmailValid] = useState<boolean>(true)
    const [metadataUri, setMetadataUri] = useState<string>('')

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
    
    
    return { email, setEmail, firstName, setFirstName, lastName, setLastName, fullAddress, setFullAddress, phoneNumber, setPhoneNumber,
        offerNumber, setOfferNumber, offerPrice, setOfferPrice, isEmailValid, setEmailValid, metadataUri, setMetadataUri,
        handleChangeEmail, handleChangeFirstName, handleChangeLastName, handleChangeFullAddress, handleChangePhoneNumber, handleOfferNumber}
}

export default customHookAcquireForm