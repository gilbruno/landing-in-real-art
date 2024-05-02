import { Button } from '@chakra-ui/react'
import styles from "./AcquireModal.module.scss"
import React from 'react'
import { AcquireFormProps } from './AcquireForm'
import useAcquireForm from './useAcquireForm'

const ButtonBuyNft = (props: AcquireFormProps) => {

    const { email, firstName, lastName, fullAddress, phoneNumber, offerNumber, offerPrice, isEmailValid, setEmailValid, metadataUri, setMetadataUri, usdBalance, 
        uploadingImgToIpfs, setUploadingImgToIpfs, uploadingMetadataToIpfs, setUploadingMetadataToIpfs, mintingNft, setMintingNft, buttonBuyDisabled, setButtonBuyDisabled,
        handleChangeEmail, handleChangeFirstName, handleChangeLastName, handleChangeFullAddress, handleChangePhoneNumber, isOkToBuy } = useAcquireForm(props.offerPrices, props.formPresaleDelivery, props.web3Address)

    //------------------------------------------------------------------------------ handlBuyArtwork
    // const handlBuyArtwork = async () => {
    //     let success = await isOkToBuy()
    //     if (success) {
    //         await handleMintNftOrder()
    //     }
    // }

    return (
        <div className={styles.rectangleSendEmail}>
            {
                /*
                (!uploadingImgToIpfs && !uploadingMetadataToIpfs && !mintingNft)
                &&
                    <Button
                        disabled={buttonBuyDisabled}
                        colorScheme="#465c79"
                        variant="solid"
                        left={"0px"}
                        onClick={handlBuyArtwork}>
                        BUY ARTWORK 
                    </Button>
                    */
            }
            
            
        </div>
  )
}

export default ButtonBuyNft