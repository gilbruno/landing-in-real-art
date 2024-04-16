import React from 'react'
import { Text } from '@chakra-ui/react'
import ToolTipOffer from '../ToolTipOffer'
import { Lang, OffersProps } from '../../../../types/types'
import styles from "./Offers.module.scss";
import { useAppContext } from '../../../../context';

const Offers = (props: OffersProps) => {
   //Get the language of the global context
  const {lang} = useAppContext()
  const lang_ = lang as Lang

  const {
    price,
    price2,
    price3,
    offers,
    investmentTexts
  } = props;


  return (
    <>
        <Text color="blue.600" fontSize="2xl">
            <div className={styles.offers}>
                <div>
                {offers.offer1[lang_]} : 
                </div>  
                <div>
                {price} € 
                </div>
                <div className={styles.offersImg}>
                    <ToolTipOffer offerNumber={1} isClosed={false} investmentTexts={investmentTexts}/>
                </div>
            </div>
            </Text>

            <Text color="blue.600" fontSize="2xl">
            <div className={styles.offers}>
                <div>
                {offers.offer2[lang_]} : 
                </div>  
                <div>
                {price2} € 
                </div>
                <div className={styles.offersImg}>
                    <ToolTipOffer offerNumber={2} isClosed={false} investmentTexts={investmentTexts}/>
                </div>
            </div>
            </Text>
            <Text color="blue.600" fontSize="2xl">
            <div className={styles.offers}>
                <div>
                {offers.offer3[lang_]} : 
                </div>  
                <div>
                {price3} € 
                </div>
                <div className={styles.offersImg}>
                    <ToolTipOffer offerNumber={3} isClosed={false} investmentTexts={investmentTexts}/>
                </div>
            </div>
        </Text>

    </>
  )
}

export default Offers