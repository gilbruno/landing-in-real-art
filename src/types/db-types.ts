import { Lang, ResourceNftStatus } from '@prisma/client';

export interface CreateOrder {
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