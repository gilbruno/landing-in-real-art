import { ResourceNftStatus } from "@prisma/client"
const pinataSDK = require('@pinata/sdk');
export const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);


type MetadataAttributesTraitType = 'gatewayImageUri' | 'orderDate' | 'orderId' | 'maxDateCancel'

interface MetadataAttributes  {
    trait_type: MetadataAttributesTraitType
    value: string
}

export type IfpsProps = {
    name: string
    description: string
    external_url: string
    image: string
    attributes: Array<MetadataAttributes>
}

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
  