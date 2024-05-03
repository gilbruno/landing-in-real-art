import { Lang, RefundPresaleStatus, ResourceNftStatus } from '@prisma/client';
import { Address } from 'viem';

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
    tokenId: number
}

export type PresaleOrder = {
    artistName: string
    artworkName: string
    hashArt?: string
    tokenId?: number | undefined
    txHash?: Address
    owner: Address
    collectionName?: string
    collectionSymbol?: string
    price: number
    status: ResourceNftStatus
    offerNumber: number
    imageUri: string
    gatewayImageUri: string
    metadataUri?: string
    gatewayMetadataUri?: string
    lang: Lang
    contractAddress: Address
    maxCancelDate: Date
}

export type BuyerPresale = {
    publicKey : Address
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
}

export type RefundPresale = {
    tokenId : number
    buyer: string
    price: number
    status?: RefundPresaleStatus
    contractAddress?: Address
}