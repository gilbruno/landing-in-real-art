import { Lang, ResourceNftStatus } from '@prisma/client';

export type CreateOrder  = {
    owner: string
    artistName: string
    artworkName: string
    price: number
    offerNumber: number
    status: ResourceNftStatus
    imageUri: string
    gatewayImageUri: string
    lang: Lang
}

export type UpdateOrder  = {
    status: ResourceNftStatus
    metadataUri: string
    gatewayMetadataUri: string
}