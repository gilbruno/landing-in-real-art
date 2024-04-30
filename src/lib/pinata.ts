import { ArtProps } from "@/types/types";
import { ResourceNftStatus } from "@prisma/client"
const pinataSDK = require('@pinata/sdk');
export const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);


type MetadataAttributesTraitType = 'gatewayImageUri' | 'orderPrice' | 'orderDate' | 'orderId' | 'maxDateCancel'

interface MetadataAttributes  {
    trait_type: MetadataAttributesTraitType
    value: string
}

const UPDATE_TOKEN_ID_ORDER_ROUTE = '/api/db/presaleOrder/update' as const

export type IfpsProps = {
    name: string
    description: string
    external_url: string
    image: string
    attributes: Array<MetadataAttributes>
}

//------------------------------------------------------------------------------ pinJsonToIpfs
export const pinJsonToIpfs = (data: IfpsProps) => {
    const { name, description, external_url, image, attributes } = data
  
    const body = {
      name: name,
      description: description,
      external_url: external_url,
      image: image,
      attributes: attributes
    }

    const options = {
      pinataMetadata: {
        name,
        keyvalues: {
          description
        }
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    pinata
      .pinJSONToIPFS(body, options)
      .then((result: any) => {
        console.log(result)
      })
      .catch((err: any) => {
        throw new Error(err)
      });
  };
  

//------------------------------------------------------------------------------ updateTokenIdOrderInDb
export const updateTokenIdOrderInDb = async (idOrder: number, tokenId: number) => {
  const data_ = {
      functionName: 'updateTokenIdPresaleOrder',
      idOrder: idOrder,
      tokenId: tokenId
  }
  try {
      const response = await fetch(UPDATE_TOKEN_ID_ORDER_ROUTE, {
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

