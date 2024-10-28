import { Box, SimpleGrid } from '@chakra-ui/react'
import styles from './Partners.module.scss'
import useSharedLogicPartners from './useSharedLogicPartners'
import { useAppContext } from '../../../context'
import { Lang } from '../../../types/types'
import Image from 'next/image';

const Partners = () => {

    //Get the language of the global context
    const {lang } = useAppContext()
    const lang_ = lang as Lang
    
    const {partnersTexts, setPartnersTexts} = useSharedLogicPartners()

    return (
        // Passing `columns={[2, null, 3]}` and `columns={{sm: 2, md: 3}}`
        // will have the same effect.*/}
        <div id="partners" className={styles.partnersContainer}>
            <div className={styles.partnersTitle}>
                {partnersTexts.mainTitle[lang_]}
            </div>
            <SimpleGrid columns={[1, null, 3]} spacing='100px' border='10px'>
                <Box margin={'auto'} >
                    <Image src='/img/partners/leadouze.jpg' alt='' width={200} height={100}/>
                </Box>
                <Box margin={'auto'} >
                    <Image src='/img/partners/retrovrs.png' alt='' width={245} height={77}/>
                </Box>
                <Box margin={'auto'} >
                    <Image src='/img/partners/art_thema.jpg' alt='' width={150} height={150}/>
                </Box>
            </SimpleGrid>
        </div> 
)
}

export default Partners